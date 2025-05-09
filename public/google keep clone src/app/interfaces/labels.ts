export interface LabelI {
    id?: number
    name: string
    added?: boolean
}

export type LabelActionsT = {
    update: (data: string) => void
    delete: () => void
}

export type UpdateKeyI = {
    [key in keyof LabelI]?: any
}

export interface LabelModelI {
    id: number
    list: LabelI[]
    db: {
        add(data: LabelI): Promise<any>
        update(data: UpdateKeyI): void
        delete(): void
        updateAllLabels(value: string): void
    }
}