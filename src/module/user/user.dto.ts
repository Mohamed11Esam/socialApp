export interface GetUserProfileDto {
  userId: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
}
