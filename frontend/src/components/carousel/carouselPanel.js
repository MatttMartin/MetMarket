function CarouselPanel(props) {
  return (
    <div  className={ props.isActive ? 'carousel-item active' : 'carousel-item'}>
      <img src={props.img} className="d-block w-100" alt={props.alt}/>
    </div>
  );
}

export default CarouselPanel;