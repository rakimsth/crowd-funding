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
  Dropdown,
  DropdownButton,
  Alert,
} from 'react-bootstrap';

function Main({ closeProject, createProject, fundProject, projects }) {
  const updatedProject = projects.map((p) => {
    p.percent = p.balance
      ? Math.round(
          (Number(window.web3.utils.fromWei(p.balance, 'ether')) /
            Number(window.web3.utils.fromWei(p.target, 'ether'))) *
            100,
        )
      : 0;
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
          {updatedProject && updatedProject.length > 0 ? (
            updatedProject.map((project) => (
              <div className="col-md-4" key={project.id}>
                <Card
                  border={borderDesigns[Math.floor(Math.random() * borderDesigns.length)]}
                  className="m-2"
                >
                  <Card.Body>
                    {project && project.exists ? (
                      <span
                        className="btn btn-success"
                        style={{ position: 'absolute', top: '7px', left: '-10px' }}
                      >
                        Open
                      </span>
                    ) : (
                      <span
                        className="btn btn-danger"
                        style={{ position: 'absolute', top: '7px', left: '-10px' }}
                      >
                        Closed
                      </span>
                    )}
                    <Card.Title>
                      {project && project.name ? project.name.toString() : '-'}
                    </Card.Title>
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
                        Target/Collected:&nbsp;
                        {project && project.target && project.balance
                          ? `${window.web3.utils.fromWei(project.target, 'Ether')}
                        / ${String(window.web3.utils.fromWei(project.balance, 'Ether'))}`
                          : '-'}
                        <em> Ethers</em>
                      </ListGroupItem>
                      <ListGroupItem>
                        <small className="text-muted">
                          <em style={{ fontSize: '0.9em' }}>
                            Organized By: {project && project.owner ? project.owner : '-'}
                          </em>
                        </small>
                      </ListGroupItem>
                    </ListGroup>
                  </Card.Body>
                  {project && project.exists ? (
                    <Card.Footer className="bg-white">
                      <div className="row p-2">
                        <div className="col-md-6">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text" id="basic-addon1">
                                <i className="fab fa-ethereum" style={{ fontSize: '1.5em' }} />
                              </span>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              id={project.id}
                              name={project.id}
                              maxLength="9"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <Button
                            name={project.id}
                            style={{ color: 'white', float: 'left' }}
                            variant={
                              borderDesigns[Math.floor(Math.random() * borderDesigns.length)]
                            }
                            onClick={(e) => {
                              fundProject(
                                e.target.name,
                                document.getElementById(`${project.id}`).value,
                              );
                              document.getElementById(`${project.id}`).value = '';
                            }}
                          >
                            Donate
                          </Button>
                          <DropdownButton
                            id="dropdown-basic"
                            variant="light"
                            title=""
                            className="float-right"
                            style={{ marginLeft: '80%' }}
                          >
                            <Dropdown.Item
                              as="button"
                              name={project.id}
                              onClick={(e) => {
                                closeProject(e.target.name);
                              }}
                            >
                              Close Project
                            </Dropdown.Item>
                          </DropdownButton>
                        </div>
                      </div>
                    </Card.Footer>
                  ) : (
                    ''
                  )}
                </Card>
              </div>
            ))
          ) : (
            <div className="p-4">
              <Alert variant="danger">No Projects Found!</Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Main.propTypes = {
  createProject: PropTypes.func,
  fundProject: PropTypes.func,
  closeProject: PropTypes.func,
  projects: PropTypes.arrayOf(PropTypes.object),
};

Main.defaultProps = {
  createProject: null,
  fundProject: null,
  closeProject: null,
  projects: [],
};

export default Main;
