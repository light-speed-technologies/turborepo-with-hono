import { router } from "../trpc";
import { me } from "../features/users/me";
import { updateProfile } from "../features/users/update-profile";
import { list } from "../features/users/list";
import { get } from "../features/users/get";
import { listSessions } from "../features/users/list-sessions";
import { create } from "../features/users/create";
import { ban } from "../features/users/ban";
import { unban } from "../features/users/unban";
import { updateRole } from "../features/users/update-role";
import { deleteUser } from "../features/users/delete";
import { revokeSessions } from "../features/users/revoke-sessions";

export const userRouter = router({
  me,
  updateProfile,
  list,
  get,
  listSessions,
  create,
  ban,
  unban,
  updateRole,
  delete: deleteUser,
  revokeSessions,
});
