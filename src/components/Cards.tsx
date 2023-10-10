import '@/styles/components/Cards.scss'

type Props = {
	children: React.ReactNode
}

export default function Cards({ children }: Props) {
	return <div className="cards">{children}</div>
}