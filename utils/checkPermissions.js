import { UnauthorizedError } from "../errors/customError.js";

const checkPermissions = (requestUser, resourceUserId) => {
  //?: only who created can delete or edit further we can add admin
  if (requestUser === resourceUserId.toString()) return;
  throw new UnauthorizedError("Not authorized to access this route");
};

export default checkPermissions;
