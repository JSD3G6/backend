const httpMocks = require("node-mocks-http");
const AppError = require("../../utils/appError");
const ActivityModel = require("../../models/Activity");
const ActivityController = require("../../controllers/activityController");
const newActivity = require("../mock-data/new-activity.json");

// Spy FN
ActivityModel.create = jest.fn();

// GLOBAL
let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

// TEST SUITED
describe("ActivityController.createActivity", () => {
  beforeEach(() => {
    req.body = newActivity;
  });
  // case1 : Should Fn
  it("should have a createActivity function", () => {
    expect(typeof ActivityController.createActivity).toBe("function");
  });

  // case2 : Should create
  it("should call Activity.create", () => {
    ActivityController.createActivity(req, res, next);
    expect(ActivityModel.create).toBeCalledWith(newActivity);
  });

  // case3 : Should Return if can create
  it("should return 201 response if can create", async () => {
    ActivityModel.create.mockReturnValue(newActivity);
    await ActivityController.createActivity(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  // case4 : Should Return JSON
  it("should return json body in response", async () => {
    // outcome
    ActivityModel.create.mockReturnValue(newActivity);

    // execute
    await ActivityController.createActivity(req, res, next);

    // expect
    expect(res._getJSONData()).toStrictEqual(newActivity);
  });

  // case5 : Should return 400
  it("should return empty json if cannot create activity", async () => {
    // Outcome
    ActivityModel.create.mockReturnValue(null);

    // execute
    await ActivityController.createActivity(req, res, next);

    // expect
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });

  // case6 : Handle Error
  it("should handle Error", async () => {
    // Outcome
    const myError = new AppError("cannot create activity", 400);
    const rejectedPromise = Promise.reject(myError);
    ActivityModel.create.mockReturnValue(rejectedPromise);

    // execute
    await ActivityController.createActivity(req, res, next);

    // expect
    expect(next).toBeCalledWith(myError);
  });
});
