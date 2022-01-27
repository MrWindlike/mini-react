export interface ReactElement {
    type: string
    props: Record<string, unknown> & { children: ReactElement | ReactElement[] }
}
