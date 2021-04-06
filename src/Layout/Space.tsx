import { CSSProperties, ReactNode } from "react";
import Flex from "./Flex"

const SpaceSize = {
    'small': 4,
    'middle': 8,
    'large': 12,
}

function Space(props: {
    size?: 'small' | 'middle' | 'large',
    direction?: 'horizontal' | 'vertical',
    style?: CSSProperties,
    children: React.ReactNode[]
}) {
    const { size = "middle", direction = "horizontal", style } = props;
    const marginValue = SpaceSize[size];
    return (
        <Flex style={{ ...style, justifyContent: 'space-around' }} direction={direction && direction === 'vertical' ? 'column' : 'row'} >
            {
                props.children.map((v: ReactNode, i: number) => <Flex.Item key={`child-${i}`} style={{ marginRight: marginValue, marginLeft: marginValue }}>
                    {v}
                </Flex.Item>)
            }
        </Flex>
    )
}

export default Space