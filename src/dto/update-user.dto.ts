export class UpdateUserDto {
  field: 'email' | 'username' | 'password';
  value: string;
}
