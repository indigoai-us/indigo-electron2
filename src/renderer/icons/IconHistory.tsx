export default function IconHistory({
  size = 18, // or any default size of your choice
  className = "",
  colorClass = "text-gray-300"
}) {
  return (
    <div className={colorClass}>
      <svg className="fill-current" width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2.5C7.39502 2.5 5.09521 3.8208 3.75 5.83984V3.75H2.5V8.125H6.875V6.875H4.60938C5.68848 5.01221 7.68555 3.75 10 3.75C13.4595 3.75 16.25 6.54053 16.25 10C16.25 13.4595 13.4595 16.25 10 16.25C6.54053 16.25 3.75 13.4595 3.75 10H2.5C2.5 14.1357 5.86426 17.5 10 17.5C14.1357 17.5 17.5 14.1357 17.5 10C17.5 5.86426 14.1357 2.5 10 2.5ZM9.375 5V10.625H13.75V9.375H10.625V5H9.375Z"/>
      </svg>
    </div>
  )
}
