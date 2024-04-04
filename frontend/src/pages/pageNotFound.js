import CustomButton from "../components/general/customButton";

function PageNotFound() {
  return (
    <div className="text-center m-5 p-5">
      <h1>Error <span className="text-warning">404</span>: Page Not Found</h1>
      <p className="mb-4">We could not find the page you were looking for. </p>
      <CustomButton text="Go to Home Page" href="/"/>
    </div>
  )
  }

export default PageNotFound;