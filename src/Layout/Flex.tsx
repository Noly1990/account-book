import { CSSProperties } from "react"

export interface FlexProps {
    style?: CSSProperties,
    direction?: "-moz-initial" | "inherit" | "initial" | "revert" | "unset" | "column" | "column-reverse" | "row" | "row-reverse",
    children?: React.ReactNode
}

function Flex(props: FlexProps) {
    return (
        <div style={{ display: 'flex', flexDirection: props.direction, ...props.style }}>
            {
                props.children
            }
        </div>
    )
}

export interface FlexItemProps {
    style?: CSSProperties,
    occupy?: number,
    children?: React.ReactNode
}

Flex.Item = function Item(props: FlexItemProps) {
    return (
        <div style={{ flex: props.occupy || 1, ...props.style }}>
            {
                props.children
            }
        </div>
    )
}
export default Flex