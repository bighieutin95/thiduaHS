import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, UserPlus, FileSpreadsheet, Search, Edit, Trash2, 
  X, CheckCircle, ShieldAlert, Sparkles, Save, Calendar, ChevronLeft, ChevronRight,
  Clock, Check
} from 'lucide-react';
import RoleAvatar from '../components/RoleAvatar';
import { BACKEND_URL } from '../config';
import { DEFAULT_CLASSES, DEFAULT_STUDENTS_11C2, DEFAULT_GRADE_RECORDS, getStoredData, setStoredData } from '../lib/mockData';

interface Lop {
  lop_id: number;
  ten_lop: string;
  khoi?: number;
  to?: { to_id: number; ten_to: string }[];
}

interface HocSinh {
  hoc_sinh_id: number;
  lop_id: number;
  to_id: number | null;
  ho_ten: string;
  ma_hoc_sinh: string | null;
  email: string | null;
  vai_tro_thi_dua: 'LopTruong' | 'LopPho' | 'ToTruong' | 'ToPho' | 'HocSinh';
  to?: { to_id?: number; ten_to: string };
  lop?: { ten_lop: string };
}

// Kiểu dữ liệu điểm danh: [hoc_sinh_id]: { [dayIndex: 0..6]: 'P' | 'K' | 'NV' | '' }
type AttendanceRecord = Record<number, Record<number, 'P' | 'K' | 'NV' | ''>>;

// Helper tính thứ 2 của tuần dựa vào ngày bất kỳ
function getMondayOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay(); // 0: CN, 1: T2, ..., 6: T7
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(date);
  mon.setDate(diff);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

// Format ngày: DD/MM
function formatDateDDMM(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

// Format YYYY-MM-DD
function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function StudentsPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.vai_tro_he_thong === 'Admin';
  const isGvcn = !!profile?.gvcn_lop;

  if (!isAdmin && !isGvcn) {
    return (
      <div className="page-container fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <ShieldAlert size={60} style={{ color: 'var(--color-danger)', marginBottom: '16px' }} />
        <h2 style={{ fontWeight: 800, marginBottom: '8px' }}>Quyền Truy Cập Bị Từ Chối</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '480px' }}>
          Bạn không có quyền thực hiện chức năng Quản lý học sinh. Trang này chỉ dành riêng cho Admin Quản Trị Viên và Giáo Viên Chủ Nhiệm.
        </p>
      </div>
    );
  }

  const [classes, setClasses] = useState<Lop[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number>(4); // Mặc định 11C2 (id: 4)
  const [students, setStudents] = useState<HocSinh[]>([]);
  const [selectedToId, setSelectedToId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tab View: 'attendance' (Điểm danh chuyên cần) hoặc 'list' (Hồ sơ học sinh)
  const [activeTab, setActiveTab] = useState<'attendance' | 'list'>('attendance');

  // Quản lý tuần điểm danh: khởi tạo từ thứ Hai của tuần hiện tại (hệ thống)
  const [currentMonday, setCurrentMonday] = useState<Date>(() => getMondayOfWeek(new Date()));

  // Dữ liệu điểm danh của tuần hiện tại
  const [attendance, setAttendance] = useState<AttendanceRecord>({});

  // Modal Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<HocSinh | null>(null);
  const [formData, setFormData] = useState({
    ho_ten: '',
    ma_hoc_sinh: '',
    email: '',
    to_id: '1',
    vai_tro_thi_dua: 'HocSinh' as HocSinh['vai_tro_thi_dua'],
  });

  // Modal Import Hàng Loạt
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');

  const token = localStorage.getItem('sb-access-token');

  // Tính 7 ngày trong tuần từ Thứ Hai đến Chủ Nhật
  const weekDays = useMemo(() => {
    const days: { label: string; dateStr: string; fullDate: Date }[] = [];
    const dayLabels = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentMonday);
      d.setDate(currentMonday.getDate() + i);
      days.push({
        label: dayLabels[i],
        dateStr: formatDateDDMM(d),
        fullDate: d,
      });
    }
    return days;
  }, [currentMonday]);

  // Key lưu trữ điểm danh trong localStorage theo Lớp và Tuần
  const storageAttendanceKey = useMemo(() => {
    return `attendance_lop_${selectedClassId}_week_${formatDateKey(currentMonday)}`;
  }, [selectedClassId, currentMonday]);

  // Tải dữ liệu điểm danh khi thay đổi lớp hoặc tuần
  useEffect(() => {
    const saved = getStoredData<AttendanceRecord>(storageAttendanceKey, {});
    setAttendance(saved);
  }, [storageAttendanceKey]);

  // Lưu điểm danh vào localStorage
  const saveAttendance = (newAttendance: AttendanceRecord) => {
    setAttendance(newAttendance);
    setStoredData(storageAttendanceKey, newAttendance);
  };

  // Helper tính tuần thứ mấy trong năm học
  const getTuanThu = (date: Date): number => {
    const baseDate = new Date(2026, 8, 5); // 05/09/2026
    const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const d2 = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    const diffTime = d1.getTime() - d2.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return 1 + Math.floor(diffDays / 7);
  };

  // Toggle hoặc chuyển đổi trạng thái điểm danh của 1 học sinh ở 1 ngày:
  // '' (Có mặt) -> 'P' (Có phép: -2đ) -> 'K' (Không phép: -5đ) -> 'NV' (Nằm viện: 0đ) -> ''
  const cycleAttendanceStatus = async (hocSinhId: number, dayIndex: number) => {
    const currentVal = attendance[hocSinhId]?.[dayIndex] || '';
    let nextVal: 'P' | 'K' | 'NV' | '' = '';
    if (currentVal === '') nextVal = 'P';
    else if (currentVal === 'P') nextVal = 'K';
    else if (currentVal === 'K') nextVal = 'NV';
    else nextVal = '';

    const updated = {
      ...attendance,
      [hocSinhId]: {
        ...(attendance[hocSinhId] || {}),
        [dayIndex]: nextVal,
      },
    };
    saveAttendance(updated);

    // Tính toán thông tin ngày và học sinh
    const targetDay = new Date(currentMonday);
    targetDay.setDate(currentMonday.getDate() + dayIndex);
    const dateKey = formatDateKey(targetDay);
    const dayLabel = weekDays[dayIndex]?.label || `Ngày ${dayIndex + 1}`;
    const dateDisplay = formatDateDDMM(targetDay);
    const student = students.find((s) => s.hoc_sinh_id === hocSinhId);
    const weekNum = getTuanThu(targetDay);
    const emulationRecordId = `att-rec-${hocSinhId}-${dateKey}`;

    // Lấy lịch sử chấm điểm hiện tại
    const existingRecords = getStoredData<any[]>('app_grade_records', DEFAULT_GRADE_RECORDS as any);

    if (nextVal === 'P' || nextVal === 'K') {
      const isKhongPhep = nextVal === 'K';
      const tieuChiTen = isKhongPhep ? 'Nghỉ học không phép' : 'Nghỉ học có phép';
      const soDiemTru = isKhongPhep ? '5.00' : '2.00';
      const moTa = `Điểm danh vắng ${isKhongPhep ? 'không phép (K)' : 'có phép (P)'} - ${dayLabel} (${dateDisplay})`;

      const newRecord = {
        lich_su_id: emulationRecordId,
        nguoi_cham: {
          ho_ten: profile?.ho_ten ? `${profile.ho_ten} (Điểm danh)` : 'GVCN / Cán sự (Điểm danh)',
        },
        hoc_sinh: {
          ho_ten: student?.ho_ten || 'Học sinh',
        },
        tieu_chi: {
          ten_tieu_chi: tieuChiTen,
          loai: 'Tru' as const,
        },
        so_diem_thuc_te: soDiemTru,
        ngay_vi_pham: `${dateKey}T07:30:00Z`,
        mo_ta: moTa,
        tuan_thu: weekNum,
        trang_thai: 'HieuLuc' as const,
      };

      // Cập nhật vào danh sách lịch sử chấm điểm thi đua (ghi đè nếu đã tồn tại bản ghi điểm danh ngày này)
      const filtered = existingRecords.filter((r) => r.lich_su_id !== emulationRecordId);
      const updatedRecords = [newRecord, ...filtered];
      setStoredData('app_grade_records', updatedRecords);

      setMessage({
        type: 'success',
        text: `Đã ghi nhận vắng ${nextVal} (-${soDiemTru}đ thi đua) cho [${student?.ho_ten}] vào tuần ${weekNum}!`,
      });

      // Đồng bộ Backend API nếu có kết nối
      try {
        await fetch(`${BACKEND_URL}/emulation/grade`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hoc_sinh_id: hocSinhId,
            tieu_chi_id: isKhongPhep ? 2 : 3,
            ngay_vi_pham: `${dateKey}T07:30:00Z`,
            mo_ta: moTa,
          }),
        });
      } catch {
        // offline fallback ok
      }
    } else {
      // Khi chuyển về 'NV' (Nằm viện) hoặc '' (Có mặt) -> Xóa hoặc hủy trừ điểm phát sinh từ điểm danh
      const filtered = existingRecords.filter((r) => r.lich_su_id !== emulationRecordId);
      if (filtered.length !== existingRecords.length) {
        setStoredData('app_grade_records', filtered);
        setMessage({
          type: 'success',
          text: `Đã hủy trừ điểm thi đua chuyên cần ngày ${dayLabel} cho [${student?.ho_ten}]!`,
        });
      }
    }
  };

  // Chuyển tuần
  const handlePrevWeek = () => {
    const prev = new Date(currentMonday);
    prev.setDate(prev.getDate() - 7);
    setCurrentMonday(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentMonday);
    next.setDate(next.getDate() + 7);
    setCurrentMonday(next);
  };

  const handleCurrentWeek = () => {
    setCurrentMonday(getMondayOfWeek(new Date()));
  };

  // Lấy danh sách lớp học
  useEffect(() => {
    fetchClasses();
  }, []);

  // Khi chọn lớp -> Tải danh sách học sinh
  useEffect(() => {
    if (selectedClassId) {
      fetchStudents(selectedClassId);
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setClasses(data);
          const userClassId = profile?.gvcn_lop?.lop_id || profile?.hoc_sinh?.lop_id || data[0].lop_id;
          setSelectedClassId(userClassId);
          return;
        }
      }
    } catch {
      // Fallback
    }

    const fallbackClasses = getStoredData('app_classes_list', DEFAULT_CLASSES);
    setClasses(fallbackClasses);
    setSelectedClassId(4); // Lớp 11C2
  };

  const fetchStudents = async (lopId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/students?lop_id=${lopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStudents(data);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Dữ liệu mẫu dự phòng từ mockData
    const storageKey = `students_lop_${lopId}`;
    const fallbackStudents = getStoredData<HocSinh[]>(
      storageKey,
      (lopId === 4 ? DEFAULT_STUDENTS_11C2 : DEFAULT_STUDENTS_11C2.slice(0, 8)) as any
    );
    setStudents(fallbackStudents);
    setLoading(false);
  };

  // Mở modal thêm/sửa
  const handleOpenModal = (hs?: HocSinh) => {
    const currentClass = classes.find((c) => c.lop_id === selectedClassId);
    const firstGroupId = currentClass?.to?.[0]?.to_id?.toString() || '1';

    if (hs) {
      setEditingStudent(hs);
      setFormData({
        ho_ten: hs.ho_ten,
        ma_hoc_sinh: hs.ma_hoc_sinh || '',
        email: hs.email || '',
        to_id: hs.to_id ? hs.to_id.toString() : firstGroupId,
        vai_tro_thi_dua: hs.vai_tro_thi_dua,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        ho_ten: '',
        ma_hoc_sinh: `HS${Math.floor(100 + Math.random() * 900)}`,
        email: '',
        to_id: firstGroupId,
        vai_tro_thi_dua: 'HocSinh',
      });
    }
    setIsModalOpen(true);
  };

  // Lưu học sinh (Thêm hoặc Sửa)
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ho_ten.trim()) {
      alert('Vui lòng nhập họ và tên học sinh!');
      return;
    }

    const toIdNum = parseInt(formData.to_id);
    let updated: HocSinh[];

    if (editingStudent) {
      updated = students.map((hs) =>
        hs.hoc_sinh_id === editingStudent.hoc_sinh_id
          ? {
              ...hs,
              ho_ten: formData.ho_ten.trim(),
              ma_hoc_sinh: formData.ma_hoc_sinh.trim() || null,
              email: formData.email.trim() || null,
              to_id: toIdNum,
              to: { to_id: toIdNum, ten_to: `Tổ ${toIdNum}` },
              vai_tro_thi_dua: formData.vai_tro_thi_dua,
            }
          : hs
      );
    } else {
      const newHs: HocSinh = {
        hoc_sinh_id: Date.now(),
        lop_id: selectedClassId,
        to_id: toIdNum,
        ho_ten: formData.ho_ten.trim(),
        ma_hoc_sinh: formData.ma_hoc_sinh.trim() || `HS${Math.floor(1000 + Math.random() * 9000)}`,
        email: formData.email.trim() || null,
        vai_tro_thi_dua: formData.vai_tro_thi_dua,
        to: { to_id: toIdNum, ten_to: `Tổ ${toIdNum}` },
        lop: { ten_lop: classes.find((c) => c.lop_id === selectedClassId)?.ten_lop || '11C2' },
      };
      updated = [newHs, ...students];
    }

    setStudents(updated);
    setStoredData(`students_lop_${selectedClassId}`, updated);
    setIsModalOpen(false);
    setMessage({
      type: 'success',
      text: editingStudent ? 'Đã cập nhật thông tin học sinh thành công!' : 'Đã thêm học sinh mới vào lớp!',
    });

    // Thử đồng bộ Backend
    try {
      const payload = {
        lop_id: selectedClassId,
        to_id: toIdNum,
        ho_ten: formData.ho_ten,
        ma_hoc_sinh: formData.ma_hoc_sinh || null,
        email: formData.email || null,
        vai_tro_thi_dua: formData.vai_tro_thi_dua,
      };
      if (editingStudent) {
        await fetch(`${BACKEND_URL}/students/${editingStudent.hoc_sinh_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${BACKEND_URL}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }
    } catch {
      // Offline fallback ok
    }
  };

  // Xóa học sinh
  const handleDeleteStudent = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi danh sách lớp?')) return;
    const updated = students.filter((hs) => hs.hoc_sinh_id !== id);
    setStudents(updated);
    setStoredData(`students_lop_${selectedClassId}`, updated);
    setMessage({ type: 'success', text: 'Đã xóa học sinh khỏi danh sách lớp!' });

    try {
      await fetch(`${BACKEND_URL}/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Offline fallback ok
    }
  };

  // Import danh sách hàng loạt
  const handleImportList = async () => {
    if (!importText.trim()) return;
    const lines = importText.split('\n').filter((l) => l.trim().length > 0);
    const parsedList: HocSinh[] = lines.map((line, idx) => {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      const toIdNum = parts[2] ? parseInt(parts[2]) : 1;
      return {
        hoc_sinh_id: Date.now() + idx,
        lop_id: selectedClassId,
        to_id: toIdNum,
        ho_ten: parts[0] || `Học sinh ${idx + 1}`,
        ma_hoc_sinh: parts[1] || `hs${2000000000 + idx}`,
        email: parts[3] || null,
        vai_tro_thi_dua: 'HocSinh',
        to: { to_id: toIdNum, ten_to: `Tổ ${toIdNum}` },
      };
    });

    const updated = [...parsedList, ...students];
    setStudents(updated);
    setStoredData(`students_lop_${selectedClassId}`, updated);
    setMessage({ type: 'success', text: `Đã nhập thành công ${parsedList.length} học sinh vào lớp!` });
    setIsImportModalOpen(false);
    setImportText('');
  };

  // Lọc học sinh
  const filteredStudents = useMemo(() => {
    return students.filter((hs) => {
      const matchesSearch =
        hs.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hs.ma_hoc_sinh && hs.ma_hoc_sinh.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTo = selectedToId === 'all' || hs.to_id?.toString() === selectedToId;
      return matchesSearch && matchesTo;
    });
  }, [students, searchTerm, selectedToId]);

  // Thống kê điểm danh trong tuần
  const attendanceStats = useMemo(() => {
    let countP = 0;
    let countK = 0;
    let countNV = 0;

    Object.values(attendance).forEach((studentDays) => {
      Object.values(studentDays).forEach((status) => {
        if (status === 'P') countP++;
        if (status === 'K') countK++;
        if (status === 'NV') countNV++;
      });
    });

    return { countP, countK, countNV };
  }, [attendance]);

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.6rem', fontWeight: 800 }}>
            <Users size={28} style={{ color: 'var(--color-primary)' }} />
            Quản Lý Học Sinh & Điểm Danh Tuần
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Điểm danh chuyên cần 7 ngày trong tuần (P: Có phép, K: Không phép, NV: Nằm viện) và quản lý ban cán sự lớp
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setIsImportModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileSpreadsheet size={16} /> Nhập Excel / Copy Text
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
            <UserPlus size={16} /> Thêm Học Sinh
          </button>
        </div>
      </div>

      {/* Thông báo Alert */}
      {message && (
        <div
          style={{
            padding: '0.8rem 1rem',
            borderRadius: 'var(--border-radius-md)',
            marginBottom: '1.2rem',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: message.type === 'success' ? '#10b981' : '#ef4444',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <CheckCircle size={18} /> {message.text}
          </span>
          <button onClick={() => setMessage(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Thanh chọn Chế độ hiển thị (Tabs) & Lớp */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
        <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('attendance')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: activeTab === 'attendance' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'attendance' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            <Clock size={16} /> 📋 Điểm Danh 7 Ngày (T2 - CN)
          </button>
          <button
            onClick={() => setActiveTab('list')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: activeTab === 'list' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'list' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            <Users size={16} /> 👥 Hồ Sơ Học Sinh & Chức Vụ
          </button>
        </div>

        {/* Chọn lớp & tổ */}
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Lớp:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {classes.map((c) => (
                <option key={c.lop_id} value={c.lop_id}>
                  Lớp {c.ten_lop}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tổ:</label>
            <select
              value={selectedToId}
              onChange={(e) => setSelectedToId(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <option value="all">Tất cả các Tổ</option>
              <option value="1">Tổ 1</option>
              <option value="2">Tổ 2</option>
              <option value="3">Tổ 3</option>
              <option value="4">Tổ 4</option>
            </select>
          </div>

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Tìm theo tên học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: BẢNG ĐIỂM DANH CHUYÊN CẦN 7 NGÀY (THỨ HAI ĐẾN CHỦ NHẬT)         */}
      {/* ========================================================================= */}
      {activeTab === 'attendance' && (
        <div className="card" style={{ padding: '1.2rem', marginBottom: '1.5rem', borderRadius: '12px' }}>
          {/* Thanh điều khiển tuần & Chú thích */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingBottom: '1rem',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            {/* Chuyển tuần */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handlePrevWeek}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                title="Xem tuần trước"
              >
                <ChevronLeft size={16} /> Tuần trước
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Thứ Hai, {weekDays[0]?.dateStr} — CN, {weekDays[6]?.dateStr}/{currentMonday.getFullYear()}
                </span>
              </div>

              <button
                onClick={handleNextWeek}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                title="Xem tuần kế tiếp"
              >
                Tuần sau <ChevronRight size={16} />
              </button>

              <button
                onClick={handleCurrentWeek}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: 600 }}
                title="Quay về tuần chứa ngày hệ thống hôm nay"
              >
                Hôm nay
              </button>
            </div>

            {/* Chú giải mã điểm danh & Thống kê */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Quy ước:</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #10b981' }}>
                ✓ Có mặt
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #f59e0b' }}>
                P = Có phép ({attendanceStats.countP})
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #ef4444' }}>
                K = Không phép ({attendanceStats.countK})
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(139, 92, 246, 0.15)', color: '#7c3aed', padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #8b5cf6' }}>
                NV = Nằm viện ({attendanceStats.countNV})
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            💡 <em>Hướng dẫn: Bấm trực tiếp vào từng ô ngày của học sinh để chuyển nhanh trạng thái (Có mặt ➔ <b>P</b> ➔ <b>K</b> ➔ <b>NV</b> ➔ Có mặt). Dữ liệu được tự động lưu.</em>
          </p>

          {/* Bảng điểm danh */}
          <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '820px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ width: '50px', padding: '12px 10px', textAlign: 'center', fontSize: '0.85rem' }}>STT</th>
                  <th style={{ minWidth: '220px', padding: '12px 14px', fontSize: '0.85rem' }}>Họ và tên</th>
                  <th style={{ width: '80px', padding: '12px 10px', textAlign: 'center', fontSize: '0.85rem' }}>Tổ</th>
                  {weekDays.map((day, idx) => (
                    <th
                      key={idx}
                      style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: idx >= 5 ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                        borderLeft: '1px solid var(--border-color)',
                      }}
                    >
                      <div>{day.label}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', marginTop: '2px' }}>
                        {day.dateStr}
                      </div>
                    </th>
                  ))}
                  <th style={{ width: '90px', padding: '12px 8px', textAlign: 'center', fontSize: '0.85rem', borderLeft: '1px solid var(--border-color)' }}>
                    Tổng vắng
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      Không có học sinh nào trong tổ/lớp được chọn.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((hs, index) => {
                    const studentRecord = attendance[hs.hoc_sinh_id] || {};
                    let studentAbsenceCount = 0;
                    for (let i = 0; i < 7; i++) {
                      if (studentRecord[i]) studentAbsenceCount++;
                    }

                    return (
                      <tr
                        key={hs.hoc_sinh_id}
                        style={{
                          borderBottom: '1px solid var(--border-color)',
                          background: index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                        }}
                      >
                        <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <RoleAvatar role={hs.vai_tro_thi_dua} size={32} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                                {hs.ho_ten}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {hs.ma_hoc_sinh || 'Chưa có mã'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            style={{
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border-color)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                            }}
                          >
                            {hs.to?.ten_to || `Tổ ${hs.to_id || 1}`}
                          </span>
                        </td>

                        {/* 7 Cột Điểm Danh */}
                        {weekDays.map((_, dayIdx) => {
                          const status = studentRecord[dayIdx] || '';

                          let badgeStyle = {
                            background: 'rgba(16, 185, 129, 0.08)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            text: '✓',
                          };

                          if (status === 'P') {
                            badgeStyle = {
                              background: '#fef3c7',
                              color: '#b45309',
                              border: '1px solid #f59e0b',
                              text: 'P',
                            };
                          } else if (status === 'K') {
                            badgeStyle = {
                              background: '#fee2e2',
                              color: '#b91c1c',
                              border: '1px solid #ef4444',
                              text: 'K',
                            };
                          } else if (status === 'NV') {
                            badgeStyle = {
                              background: '#ede9fe',
                              color: '#6d28d9',
                              border: '1px solid #8b5cf6',
                              text: 'NV',
                            };
                          }

                          return (
                            <td
                              key={dayIdx}
                              onClick={() => cycleAttendanceStatus(hs.hoc_sinh_id, dayIdx)}
                              style={{
                                textAlign: 'center',
                                padding: '6px 4px',
                                borderLeft: '1px solid var(--border-color)',
                                cursor: 'pointer',
                                userSelect: 'none',
                                background: dayIdx >= 5 ? 'rgba(245, 158, 11, 0.02)' : 'transparent',
                              }}
                              title={`Bấm để đổi: ${hs.ho_ten} (${weekDays[dayIdx].label})`}
                            >
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '36px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  fontWeight: 800,
                                  fontSize: status === 'NV' ? '0.75rem' : '0.88rem',
                                  background: badgeStyle.background,
                                  color: badgeStyle.color,
                                  border: badgeStyle.border,
                                  boxShadow: status ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                {badgeStyle.text}
                              </div>
                            </td>
                          );
                        })}

                        {/* Tổng vắng */}
                        <td style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
                          {studentAbsenceCount > 0 ? (
                            <span
                              style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#dc2626',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                              }}
                            >
                              {studentAbsenceCount} buổi
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>0</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: BẢNG HỒ SƠ HỌC SINH & PHÂN QUYỀN BAN CÁN SỰ                      */}
      {/* ========================================================================= */}
      {activeTab === 'list' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div className="spinner"></div>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Đang tải danh sách học sinh...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <Sparkles size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Chưa có học sinh nào trong lớp</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Hãy bấm nút "Thêm Học Sinh" hoặc "Nhập Excel" để cập nhật</p>
              <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                <UserPlus size={18} /> Thêm ngay
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ width: '60px', textAlign: 'center', padding: '12px' }}>STT</th>
                    <th style={{ padding: '12px' }}>Họ và Tên</th>
                    <th style={{ padding: '12px' }}>Mã Học Sinh</th>
                    <th style={{ padding: '12px' }}>Tổ</th>
                    <th style={{ padding: '12px' }}>Chức vụ Ban Cán Sự</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ width: '120px', textAlign: 'center', padding: '12px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((hs, index) => (
                    <tr key={hs.hoc_sinh_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>{index + 1}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <RoleAvatar role={hs.vai_tro_thi_dua} size={34} />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{hs.ho_ten}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lớp {hs.lop?.ten_lop || '11C2'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <code style={{ background: 'rgba(37, 99, 235, 0.08)', color: 'var(--color-primary)', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                          {hs.ma_hoc_sinh || 'N/A'}
                        </code>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className="badge badge-primary">{hs.to?.ten_to || `Tổ ${hs.to_id || 1}`}</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <RoleAvatar role={hs.vai_tro_thi_dua} size={24} />
                          <span style={{ fontWeight: 600 }}>
                            {hs.vai_tro_thi_dua === 'LopTruong'
                              ? 'Lớp Trưởng'
                              : hs.vai_tro_thi_dua === 'LopPho'
                              ? 'Lớp Phó'
                              : hs.vai_tro_thi_dua === 'ToTruong'
                              ? 'Tổ Trưởng'
                              : hs.vai_tro_thi_dua === 'ToPho'
                              ? 'Tổ Phó'
                              : 'Học Sinh'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {hs.email || '—'}
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleOpenModal(hs)}
                            className="btn btn-sm btn-secondary"
                            style={{ padding: '0.4rem', color: 'var(--color-primary)' }}
                            title="Sửa thông tin"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(hs.hoc_sinh_id)}
                            className="btn btn-sm btn-secondary"
                            style={{ padding: '0.4rem', color: 'var(--color-danger)' }}
                            title="Xóa học sinh"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL THÊM / SỬA HỌC SINH */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '500px', width: '90%', borderRadius: '16px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 800 }}>
                {editingStudent ? <Edit size={20} /> : <UserPlus size={20} />}
                {editingStudent ? 'Sửa Thông Tin Học Sinh' : 'Thêm Học Sinh Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Họ và tên học sinh <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.ho_ten}
                  onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Mã học sinh:
                  </label>
                  <input
                    type="text"
                    placeholder="hs2001..."
                    value={formData.ma_hoc_sinh}
                    onChange={(e) => setFormData({ ...formData, ma_hoc_sinh: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Thuộc Tổ:
                  </label>
                  <select
                    value={formData.to_id}
                    onChange={(e) => setFormData({ ...formData, to_id: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box', cursor: 'pointer' }}
                  >
                    <option value="1">Tổ 1</option>
                    <option value="2">Tổ 2</option>
                    <option value="3">Tổ 3</option>
                    <option value="4">Tổ 4</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Chức vụ ban cán sự:
                </label>
                <select
                  value={formData.vai_tro_thi_dua}
                  onChange={(e) => setFormData({ ...formData, vai_tro_thi_dua: e.target.value as any })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box', cursor: 'pointer' }}
                >
                  <option value="HocSinh">👦 Học sinh</option>
                  <option value="LopTruong">🎓 Lớp Trưởng</option>
                  <option value="LopPho">📑 Lớp Phó</option>
                  <option value="ToTruong">🚩 Tổ Trưởng</option>
                  <option value="ToPho">🏷️ Tổ Phó</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Email (Tùy chọn):
                </label>
                <input
                  type="email"
                  placeholder="hs@thiduahs.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <Save size={16} /> Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL IMPORT EXCEL / TEXT COPY */}
      {isImportModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px', width: '90%', borderRadius: '16px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 800 }}>
                <FileSpreadsheet size={20} /> Nhập Danh Sách Học Sinh Hàng Loạt
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Copy và dán trực tiếp danh sách học sinh từ file Excel hoặc Word. Mỗi dòng 1 học sinh theo định dạng:
                <br />
                <code>Họ và Tên, Mã Học Sinh, Số Thứ Tự Tổ (1-4), Email</code>
              </p>

              <textarea
                rows={8}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={`Ví dụ:\nNguyễn Văn A, hs21001, 1, a@thiduahs.com\nTrần Thị B, hs21002, 2, b@thiduahs.com\nLê Văn C, hs21003, 3`}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsImportModalOpen(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={handleImportList} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <Check size={16} /> Bắt đầu Nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
