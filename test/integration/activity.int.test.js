const request = require("supertest");
const app = require("../../app");
const newActivity = require("../mock-data/new-activity.json");

const endpointURL = "/activity";

describe(endpointURL, () => {
  it("POST" + endpointURL, async () => {
    const response = await request(app).post(endpointURL).send(newActivity);
    expect(response.statusCode).toBe(201);
    expect(response.body.type).toBe(newActivity.type);
    expect(response.body.durationMin).toBe(newActivity.durationMin);
    expect(response.body.dateTime).toBe(newActivity.dateTime);
    expect(response.body.title).toBe(newActivity.title);
    expect(response.body.caloriesBurnedCal).toBe(newActivity.caloriesBurnedCal);
  });
});
