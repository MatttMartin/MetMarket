import CarouselPanel from "./carouselPanel";

function Carousel(props) {
  console.log(props);
  return (
    <div id="carouselIndicators" className="carousel carousel-dark slide">
  <div className="carousel-indicators">
  {props.items.length > 1 ?
    props.items.map((item, index) => (
      <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to={index} className={index == 0 ? 'active' : ''} aria-current={index == 0 ? true : false} aria-label={`Slide ${index}`} key={index}></button>
    ))
    : ""
  }
  </div>
  <div className="carousel-inner">
    {props.items.map((item, index) => (<CarouselPanel 
      img={item}
      alt={`image number ${index}`}
      key={index}
      isActive={index == 0 ? true : false}
    />) )}
  </div>
  {
    props.items.length > 1 ?
      (<div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselIndicators" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselIndicators" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
      </div>
      )
    : ""

  }
  
</div>
  );
}

export default Carousel;