import { router } from "../trpc";
import { list } from "../features/users/list";
import { get } from "../features/users/get";
import { create } from "../features/users/create";
import { update } from "../features/users/update";
import { deleteUser } from "../features/users/delete";

/**
 * User router that combines all user-related procedures
 */
export const userRouter = router({
  list,
  get,
  create,
  update,
  delete: deleteUser,
});
