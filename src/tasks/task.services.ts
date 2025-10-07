import { PrismaClient } from "@prisma/client"; 
const prisma = new PrismaClient();

export const taskservice = {

    async createtask(data: {
       title: string;
       description: string;
       dueDate: Date;
       assignedToId: string;
       projectId: string; 
    }) {
        return Prisma.task.create({
            data,
        });
    }
}