function Space(props: {
    size: 'small' | 'middle' | 'large',
    children: React.ReactNode
}) {
    return (
        <div style={{ display: 'inline-block' }}>
            {
                props.children
            }
        </div>
    )
}

export default Space