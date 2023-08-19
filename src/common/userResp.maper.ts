import {IUser, UserResp} from "../modules/user/user.model";

function userMapper(iUser: IUser): UserResp {
    return {
        _id: iUser._id.toString(),
        email: iUser.email,
        firstName: iUser.firstName,
        lastName: iUser.lastName,
        avatar: iUser.avatar,
    };
}

export const userRespMapper = userMapper;
