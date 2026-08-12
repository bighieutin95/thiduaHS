import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class SupabaseAuthGuard implements CanActivate {
    private readonly config;
    private readonly logger;
    private readonly supabase;
    constructor(config: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
