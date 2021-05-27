/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Row, Col } from 'react-bootstrap';

function Main() {
  return (
    <div id="content">
      <h1>Add Project</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Row>
          <Col>
            <div className="form-group mr-sm-2 mb-sm-2">
              <label htmlFor="projectName">Project Name</label>
              <input
                id="projectName"
                type="text"
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
                className="form-control"
                placeholder="Project Target"
                required
              />
            </div>
          </Col>
        </Row>

        <div className="form-group mr-sm-2 mb-sm-2">
          <input
            id="projectDesc"
            type="text"
            className="form-control"
            placeholder="Project Description"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Project
        </button>
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

export default Main;
