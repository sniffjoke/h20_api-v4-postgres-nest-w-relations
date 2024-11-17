import { ForbiddenException } from '@nestjs/common';


export class UsersCheckHandler {
  checkIsOwner(featureOwnerId: number, userId: number) {
    console.log(typeof featureOwnerId, typeof userId);
    if (featureOwnerId !== userId) {
      throw new ForbiddenException('User is not owner');
    } else {
      return true;
    }
  }
}
