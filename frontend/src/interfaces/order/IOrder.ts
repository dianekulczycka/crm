export interface IOrder {
    id: number,
    name: string | null,
    surname: string | null,
    email: string | null,
    phone: string | null,
    age: number | null,
    course: string | null,
    courseFormat: string | null,
    courseType: string | null,
    sum: number | null,
    alreadyPaid: number | null,
    createdAt: string | null,
    utm: string | null,
    msg: string | null,
    status: string | null,
    manager: string | null,
    groupName: string | null
}