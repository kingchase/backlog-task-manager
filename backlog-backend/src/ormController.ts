import { Repository } from "typeorm";
import { User } from "./entities/user.entity";


// export async function upsertUser(userRepository: Repository<User>, req: Request) {
//     try {
//         const user = await userRepository.findOneOrFail(req.params.id);
//     } catch {

//     }
// }