interface PageLayoutProps {
  children?: unknown
  className?: string
}

export function PageLayout(props: PageLayoutProps) {
  return (
    <main className={props.className ? `page-layout ${props.className}` : 'page-layout'}>
      {props.children}
    </main>
  )
}
