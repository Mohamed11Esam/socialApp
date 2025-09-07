import bcrypt from "bcryptjs";

export const generateHash = (data: string): string => {

    return bcrypt.hashSync(data, 10);
};

export const compareHash = (data: string, hash: string): boolean => {
    return bcrypt.compareSync(data, hash);
};
