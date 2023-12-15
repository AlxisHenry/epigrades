import '@/styles/components/Cards.scss'

type Props = {
	className?: string
	children: React.ReactNode
}

export default function Cards({ className, children }: Props) {
	return <div className={`cards ${className}`}>{children}</div>
}