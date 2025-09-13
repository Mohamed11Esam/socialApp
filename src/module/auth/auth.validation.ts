import {z} from 'zod';
import { RegisterDto } from './auth.dto';
import { GENDER } from '../../utils';

export const registerSchema = z.object<RegisterDto>({
    fullName: z.string().min(2, 'Full name must be at least 2 characters long').max(100, 'Full name must be at most 100 characters long') as unknown as string,
    email: z.email('Invalid email address') as unknown as string,
    password: z.string().min(6, 'Password must be at least 6 characters long').max(100, 'Password must be at most 100 characters long') as unknown as string,
    phone: z.string().optional() as unknown as string | undefined,
    gender: z.enum(GENDER).optional() as unknown as GENDER | undefined,
})