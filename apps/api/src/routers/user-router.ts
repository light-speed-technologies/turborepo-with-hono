import { router } from "../trpc/index.js";
import { me } from "../features/users/me.js";
import { updateProfile } from "../features/users/update-profile.js";
import { list } from "../features/users/list.js";
import { get } from "../features/users/get.js";
import { listSessions } from "../features/users/list-sessions.js";
import { create } from "../features/users/create.js";
import { ban } from "../features/users/ban.js";
import { unban } from "../features/users/unban.js";
import { updateRole } from "../features/users/update-role.js";
import { deleteUser } from "../features/users/delete.js";
import { revokeSessions } from "../features/users/revoke-sessions.js";

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
