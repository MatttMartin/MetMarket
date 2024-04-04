function AvailabilityStatus(props) {
  return (
    <span className={
            "mx-2 px-2 py-1 rounded fs-6 align-middle " + 
            (props.available ? "bg-blue text-white" : "bg-yellow")
          }
    >
      {props.available ? 'Available' : 'Not Available'}
    </span>
  )
  }

export default AvailabilityStatus;