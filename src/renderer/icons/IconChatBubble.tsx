export default function IconChatBubble({
    size = 16, // or any default size of your choice
    className = "",
    colorClass = "text-gray-300"
  }) {
    return (
      <div className={colorClass}>
        <svg className="fill-current" width={size} height={size} viewBox="0 0 435.244 435.244" xmlns="http://www.w3.org/2000/svg">
        <path d="M75.146,425.343v-96.354C27.281,294.43,0,244.745,0,191.603C0,91.414,97.624,9.901,217.622,9.901
			s217.622,81.513,217.622,181.701c0,100.186-97.624,181.701-217.622,181.701c-14.218,0-28.533-1.189-42.631-3.539L75.146,425.343z
			 M217.622,39.177c-103.854,0-188.346,68.379-188.346,152.425c0,45.561,25.014,88.418,68.636,117.568l6.504,4.346v62.022
			l65.497-36.452l5.2,0.973c14.021,2.63,28.321,3.968,42.508,3.968c103.856,0,188.346-68.376,188.346-152.425
			C405.968,107.556,321.479,39.177,217.622,39.177z"/>        
        </svg>
      </div>
    )
  }