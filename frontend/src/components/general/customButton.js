function CustomButton({isBlue = true, href, text}) {
  return (
    <a type="button" 
       className={`btn ${isBlue == true ? 'btn-primary text-white' : 'btn-yellow'} rounded border-0 p-2 px-4`} 
       href={href}>
      { text }
    </a>
  )
  }

export default CustomButton;