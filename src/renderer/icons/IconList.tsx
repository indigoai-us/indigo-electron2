export default function IconList({
  size = 18, // or any default size of your choice
  className = "",
  colorClass = "text-gray-300"
}) {
  return (
    <div className={colorClass}>
      <svg className="fill-current" width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">

<path d="M6.66669 5H17.5" stroke="#A4A4C2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.66669 10H17.5" stroke="#A4A4C2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.66669 15H17.5" stroke="#A4A4C2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.5 5H2.50833" stroke="#A4A4C2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.5 10H2.50833" stroke="#A4A4C2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.5 15H2.50833" stroke="#A4A4C2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    </div>
  )
}
