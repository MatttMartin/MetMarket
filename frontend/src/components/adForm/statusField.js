import AvailabilityStatus from "../../components/general/availabilityStatus";

function StatusFields(props) {

  return (
    <div>
      <h2>Item Status</h2>
      <div className="mb-3">Status: <AvailabilityStatus available={props.status}/></div>
      <div className="mb-3 form-check form-switch">
        <label className="form-check-label" htmlFor="is_available">
        </label>
        <input className="form-check-input" type="checkbox" name="is_available" value={props.status} id="is-available" checked={props.status}
                onChange={() => {props.change()}
            }
        />
      </div>
    </div>
  );
}

export default StatusFields;