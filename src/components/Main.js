/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Modal,
  Button,
  Card,
  ProgressBar,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';

function Main({ createProject, projects }) {
  const updatedProject = projects.map((p) => {
    p.percent = Math.round(
      (p.balance
        ? Number(window.web3.utils.fromWei(p.balance, 'ether'))
        : 0 / Number(window.web3.utils.fromWei(p.target, 'ether'))) * 100,
    );
    p.daysLeft = p.endDate
      ? Math.ceil((Number(p.endDate) - new Date().getTime()) / 1000 / 60 / 60 / 24)
      : '0';
    return p;
  });
  const borderDesigns = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];
  // Handle Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Form Handle
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
      <div>
        <Modal size="lg" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
              </Row>
              <input className="btn btn-danger m-2" type="reset" value="Reset" />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" form="addNewProject" variant="primary">
              Add Project
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="row">
        <div className="col-md-10 col-sm-6">
          <h2>Our Latest Projects</h2>
        </div>
        <div className="col-md-2 col-sm-6">
          <Button variant="primary" className="float-right" onClick={handleShow}>
            Add New Project
          </Button>
        </div>
      </div>
      <div className="container-fluid justify-content-center">
        <div className="row text-center">
          {updatedProject.map((project) => (
            <div className="col-md-4">
              <Card
                border={borderDesigns[Math.floor(Math.random() * borderDesigns.length)]}
                className="m-2"
                key={project.id}
              >
                <Card.Body>
                  <Card.Title>{project && project.name ? project.name.toString() : '-'}</Card.Title>
                  <Card.Text>
                    <em>{project && project.desc ? project.desc.toString() : '0'}</em>
                  </Card.Text>
                  <ProgressBar animated now={project.percent} label={`${project.percent}%`} />
                  <ListGroup className="list-group-flush">
                    <ListGroupItem>
                      {project && project.daysLeft && project.daysLeft >= 0
                        ? project.daysLeft
                        : '-'}
                      <em> Days Left</em>
                    </ListGroupItem>
                    <ListGroupItem>
                      <small className="text-muted">
                        <em style={{ fontSize: '0.9em' }}>
                          By: {project && project.owner ? project.owner : '-'}
                        </em>
                      </small>
                    </ListGroupItem>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <Button
                    style={{ color: 'white' }}
                    variant={borderDesigns[Math.floor(Math.random() * borderDesigns.length)]}
                  >
                    Donate
                  </Button>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Main.propTypes = {
  createProject: PropTypes.func,
  projects: PropTypes.arrayOf(PropTypes.object),
};

Main.defaultProps = {
  createProject: null,
  projects: [],
};

export default Main;
