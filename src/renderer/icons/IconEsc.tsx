export default function IconEsc({
  size = 18, // or any default size of your choice
  colorClass = "text-gray-300"
}) {
  return (
    <div className={colorClass}>
      <svg className="fill-current" width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.0726 15.945C19.3335 15.945 18.6971 15.7776 18.1635 15.4428C17.6332 15.1048 17.2255 14.6391 16.9405 14.0458C16.6555 13.4525 16.5129 12.7731 16.5129 12.0075C16.5129 11.2319 16.6588 10.5475 16.9504 9.9542C17.2421 9.35761 17.6531 8.89194 18.1834 8.55718C18.7137 8.22243 19.3385 8.05505 20.0577 8.05505C20.6377 8.05505 21.1547 8.16277 21.6088 8.37821C22.0629 8.59033 22.4291 8.88862 22.7075 9.27309C22.9893 9.65756 23.1566 10.1067 23.2097 10.6204H21.7629C21.6834 10.2624 21.5011 9.9542 21.2161 9.69568C20.9343 9.43716 20.5565 9.30789 20.0825 9.30789C19.6682 9.30789 19.3053 9.41727 18.9938 9.63602C18.6855 9.85146 18.4452 10.1597 18.2729 10.5607C18.1005 10.9585 18.0144 11.4291 18.0144 11.9727C18.0144 12.5295 18.0989 13.0101 18.2679 13.4144C18.4369 13.8188 18.6756 14.132 18.9838 14.3541C19.2954 14.5761 19.6616 14.6872 20.0825 14.6872C20.3643 14.6872 20.6195 14.6358 20.8482 14.533C21.0802 14.427 21.2741 14.2762 21.4298 14.0806C21.5889 13.8851 21.7 13.6498 21.7629 13.3747H23.2097C23.1566 13.8685 22.9959 14.3093 22.7274 14.6971C22.459 15.0849 22.0994 15.3898 21.6486 15.6119C21.2012 15.8339 20.6758 15.945 20.0726 15.945Z"/>
      <path d="M15.0723 10.0188L13.725 10.2575C13.6687 10.0851 13.5792 9.92106 13.4566 9.76528C13.3372 9.6095 13.1748 9.4819 12.9693 9.38247C12.7639 9.28304 12.507 9.23332 12.1988 9.23332C11.7778 9.23332 11.4265 9.32778 11.1448 9.5167C10.8631 9.70231 10.7222 9.9426 10.7222 10.2376C10.7222 10.4928 10.8167 10.6983 11.0056 10.8541C11.1945 11.0098 11.4994 11.1374 11.9203 11.2369L13.1334 11.5153C13.8361 11.6777 14.3597 11.9279 14.7044 12.266C15.0491 12.6041 15.2215 13.0432 15.2215 13.5835C15.2215 14.0408 15.0889 14.4485 14.8238 14.8065C14.5619 15.1611 14.1957 15.4395 13.725 15.6417C13.2577 15.8439 12.7158 15.945 12.0993 15.945C11.2442 15.945 10.5465 15.7627 10.0063 15.3981C9.46603 15.0302 9.1346 14.5082 9.01196 13.832L10.4488 13.6133C10.5382 13.9878 10.7222 14.2712 11.0006 14.4634C11.279 14.6524 11.6419 14.7468 12.0894 14.7468C12.5766 14.7468 12.966 14.6457 13.2577 14.4435C13.5494 14.2381 13.6952 13.9878 13.6952 13.6928C13.6952 13.4542 13.6057 13.2537 13.4267 13.0913C13.2511 12.9289 12.9809 12.8062 12.6164 12.7234L11.3238 12.44C10.6112 12.2776 10.0842 12.0191 9.74279 11.6644C9.40472 11.3098 9.23568 10.8607 9.23568 10.3171C9.23568 9.86637 9.36163 9.47196 9.61353 9.13389C9.86542 8.79582 10.2134 8.53233 10.6576 8.34341C11.1017 8.15117 11.6104 8.05505 12.1838 8.05505C13.0091 8.05505 13.6587 8.23403 14.1327 8.59199C14.6067 8.94663 14.9199 9.42224 15.0723 10.0188Z"/>
      <path d="M4.42452 15.945C3.67215 15.945 3.02418 15.7842 2.48062 15.4627C1.94038 15.1379 1.52276 14.6822 1.22778 14.0955C0.936117 13.5056 0.790283 12.8145 0.790283 12.0224C0.790283 11.2402 0.936117 10.5508 1.22778 9.9542C1.52276 9.35761 1.93375 8.89194 2.46074 8.55718C2.99104 8.22243 3.61083 8.05505 4.32011 8.05505C4.75098 8.05505 5.1686 8.12631 5.57295 8.26883C5.97731 8.41135 6.34024 8.63507 6.66173 8.94C6.98323 9.24492 7.23678 9.64099 7.42239 10.1282C7.60799 10.6121 7.7008 11.2004 7.7008 11.8931V12.4201H1.63048V11.3065H6.24412C6.24412 10.9154 6.16457 10.569 6.00548 10.2674C5.84639 9.96249 5.62267 9.72219 5.33432 9.54653C5.04928 9.37087 4.71453 9.28304 4.33006 9.28304C3.91244 9.28304 3.54786 9.38578 3.23631 9.59128C2.92807 9.79345 2.68943 10.0586 2.5204 10.3867C2.35468 10.7115 2.27182 11.0645 2.27182 11.4457V12.3157C2.27182 12.8261 2.36131 13.2603 2.54028 13.6183C2.72257 13.9762 2.97613 14.2497 3.30094 14.4386C3.62575 14.6242 4.00525 14.717 4.43943 14.717C4.72115 14.717 4.97802 14.6772 5.21003 14.5977C5.44204 14.5148 5.64256 14.3922 5.81159 14.2298C5.98062 14.0674 6.10989 13.8668 6.19937 13.6282L7.60633 13.8818C7.49365 14.2961 7.29147 14.659 6.9998 14.9705C6.71145 15.2788 6.34852 15.5191 5.91102 15.6914C5.47684 15.8605 4.98133 15.945 4.42452 15.945Z"/>
      </svg>
    </div>
  )
}