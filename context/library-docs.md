# Dorovu — Library Usage Guide

How we use specific libraries in this project.

---

## Prisma (Backend)

Always import the singleton:
```ts
import { prisma } from '../lib/prisma'
```

Common patterns:
```ts
// find one or throw
const user = await prisma.user.findUniqueOrThrow({ where: { id } })

// find with relation
const product = await prisma.product.findUnique({
  where: { id },
  include: { crafter: true, variants: true },
})

// paginate
const products = await prisma.product.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' },
})

// transaction
await prisma.$transaction([
  prisma.order.create({ data: orderData }),
  prisma.product.update({ where: { id }, data: { stock: { decrement: 1 } } }),
])
```

---

## Zod (Shared)

Define schemas in `packages/shared/src/schemas/`:
```ts
export const CreateProductSchema = z.object({
  title: z.string().min(3).max(100),
  price: z.number().positive(),
  description: z.string().min(10),
  craftType: z.enum(CRAFT_TYPES),
  isCustomOrder: z.boolean().default(false),
  leadTimeDays: z.number().optional(),
})

export type CreateProductDTO = z.infer<typeof CreateProductSchema>
```

Use in API:
```ts
const data = CreateProductSchema.parse(req.body)
```

Use in frontend form:
```ts
const form = useForm<CreateProductDTO>({
  resolver: zodResolver(CreateProductSchema),
})
```

---

## TanStack Query (Frontend)

Always wrap API calls in query/mutation hooks inside `hooks/`:
```ts
// hooks/use-products.ts
export const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.get('/products', { params: filters }).then(r => r.data),
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProductDTO) => api.post('/products', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}
```

Use in component:
```ts
const { data, isLoading } = useProducts({ craftType: 'crochet' })
const { mutate: createProduct } = useCreateProduct()
```

---



## shadcn/ui (Frontend)

Install components via CLI:
```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add form
```

Never modify files in `components/ui/`.
Import from `@/components/ui/button` etc.

- **Dialog Component (Base-UI)**: The `Dialog` component in this project uses `@base-ui/react`. Elements like `DialogTrigger` do **not** use the `asChild` prop. Instead, use the `render` prop.
  - **Correct**: `<DialogTrigger render={<Button>Open</Button>}>...</DialogTrigger>`
  - **Incorrect**: `<DialogTrigger asChild><Button>...</Button></DialogTrigger>`

---

## Toast Notifications (Sonner)

Always use `sonner` for toast notifications. **Do not** install or use `react-hot-toast`.
```ts
import { toast } from 'sonner'

toast.success('Action successful!')
toast.error('Something went wrong.')
```

---

## Socket.io (Frontend + Backend)

Backend setup in `src/socket/socket.handler.ts`:
```ts
export const initSocket = (server: HttpServer) => {
  const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } })

  io.use((socket, next) => {
    // verify JWT from cookie on handshake
  })

  io.on('connection', (socket) => {
    socket.join(`user:${socket.data.userId}`)

    socket.on('disconnect', () => {})
  })

  return io
}

// emit to specific user from anywhere
export const emitToUser = (io: Server, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data)
}
```

Frontend in `lib/socket.ts`:
```ts
export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  withCredentials: true,
  autoConnect: false,
})
```

Connect after login, disconnect on logout.

---

## Cloudinary (Backend)

Config in `src/lib/cloudinary.ts`:
```ts
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
```

Upload with Multer (memory storage) + Cloudinary stream:
```ts
const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'dorovu/products' },
      (err, result) => {
        if (err) reject(err)
        else resolve(result!.secure_url)
      }
    )
    stream.end(buffer)
  })
}
```

Store only the returned URL in the database.