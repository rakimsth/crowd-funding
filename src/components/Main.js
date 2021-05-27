/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

function Main({ createProject }) {
  const nameRef = React.useRef();
  const descRef = React.useRef();
  const endDateRef = React.useRef();
  const targetRef = React.useRef();
  const [targetAmt, setTargetAmt] = useState('');

  const handleTargetChange = (evt) => {
    const decimalPattern = /^[+-]?\d*(?:[.,]\d*)?$/;
    if (decimalPattern.test(evt.target.value)) setTargetAmt(evt.target.value);
  };

  return (
    <div id="content" className="mt-2">
      <h2>Add Project</h2>
      <form
        id="addNewProject"
        onSubmit={(event) => {
          event.preventDefault();
          const name = nameRef.current.value;
          const desc = descRef.current.value;
          const closingDate = new Date(endDateRef.current.value).valueOf();
          const target = window.web3.utils.toWei(targetRef.current.value.toString(), 'Ether');
          createProject(name, desc, closingDate, target);
        }}
      >
        <Row>
          <Col>
            <div className="form-group mr-sm-2 mb-sm-2">
              <label htmlFor="projectName">Project Name</label>
              <input
                id="projectName"
                type="text"
                ref={nameRef}
                className="form-control"
                placeholder="Project Name"
                required
              />
            </div>
          </Col>
          <Col>
            <div className="form-group mr-sm-2 mb-sm-2">
              <label htmlFor="closingDate">Project Closing Date</label>
              <input
                id="closingDate"
                className="form-control"
                type="datetime-local"
                ref={endDateRef}
                placeholder="Closing Date"
                required
              />
            </div>
          </Col>
          <Col>
            <div className="form-group mr-sm-2 mb-sm-2">
              <label htmlFor="projectTarget">Target Amount (Eth)</label>
              <input
                id="projectTarget"
                type="text"
                ref={targetRef}
                className="form-control"
                placeholder="Project Target"
                maxLength={9}
                pattern="[+-]?\d+(?:[.,]\d+)?"
                onChange={(e) => handleTargetChange(e)}
                value={targetAmt}
                required
              />
            </div>
          </Col>
        </Row>

        <div className="form-group mr-sm-2 mb-sm-2">
          <input
            id="projectDesc"
            type="text"
            ref={descRef}
            className="form-control"
            placeholder="Project Description"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Project
        </button>
        <input className="btn btn-danger m-2" type="reset" value="Reset" />
      </form>
      <p>&nbsp;</p>
      <h2>Fund Project</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Target</th>
            <th scope="col">Owner</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody id="projectList" />
      </table>
    </div>
  );
}

Main.propTypes = {
  createProject: PropTypes.func,
};

Main.defaultProps = {
  createProject: null,
};
export default Main;
