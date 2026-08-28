interface PostTagsProps {
  tags: string[]
  basePath: string
}

export function PostTags(props: PostTagsProps) {
  if (props.tags.length === 0) return null
  return (
    <span className="inline-flex flex-wrap gap-x-2">
      {props.tags.map((tag) => (
        <a
          key={tag}
          href={`${props.basePath}/tags/${encodeURIComponent(tag)}`}
          className="text-[0.85em] text-color-[var(--color-text-sub)] underline decoration-dotted underline-offset-[0.2em] decoration-[var(--color-text-sub)] hover:text-color-[var(--color-text-main)] hover:decoration-[var(--color-text-main)]"
        >#{tag}</a>
      ))}
    </span>
  )
}
