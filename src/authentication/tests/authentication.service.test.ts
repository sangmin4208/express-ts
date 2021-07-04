import AuthenticationService from '../authentication.service';
import TokenData from '../../interfaces/tokenData.interface';
import CreateUserDto from '../../users/user.dto';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import userModel from '../../users/user.model';

jest.mock('../../users/user.model');
describe('The AuthenticationService', () => {
  const authenticationService = new AuthenticationService();
  describe('when registering a user', () => {
    describe('when registering a user', () => {
      describe('if the email is already taken', () => {
        test('should throw an error', async () => {
          const userData: CreateUserDto = {
            firstName: 'John',
            lastName: 'Smith',
            email: 'John@smith.com',
            password: 'strongPassword123',
          };
          (userModel.findOne as any).mockResolvedValue(userData);
          await expect(
            authenticationService.register(userData)
          ).rejects.toMatchObject(
            new UserWithThatEmailAlreadyExistsException(userData.email)
          );
        });
      });
    });
  });

  describe('when creating a cookie', () => {
    const tokenData: TokenData = {
      token: '',
      expiresIn: 1,
    };
    it('should return a string', () => {
      expect(typeof authenticationService.createCookie(tokenData)).toEqual(
        'string'
      );
    });
  });
});
