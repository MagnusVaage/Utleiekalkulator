import test from "node:test";
import assert from "node:assert/strict";
import { extractModelNumber, modelKey, parseCondition } from "../src/normalize.ts";

test("modelKey normaliserer skilletegn og store/små bokstaver", () => {
  assert.equal(modelKey("WW90T534AAW/S6"), "WW90T534AAWS6");
  assert.equal(modelKey("ew6f5248g3"), "EW6F5248G3");
  assert.equal(modelKey("HF 8-BAR"), "HF8BAR");
});

test("extractModelNumber finner modellnummer i tittel", () => {
  assert.equal(
    extractModelNumber("Samsung WW90T534AAW/S6 vaskemaskin selges"),
    "WW90T534AAW/S6",
  );
  assert.equal(extractModelNumber("Electrolux EW6F5248G3 – pent brukt"), "EW6F5248G3");
  assert.equal(extractModelNumber("Bosch WGG244A0SN (2023) lite brukt"), "WGG244A0SN");
});

test("extractModelNumber avviser enheter, årstall og rene ord/tall", () => {
  assert.equal(extractModelNumber("iPhone 13 Pro 128GB selges billig"), null);
  assert.equal(extractModelNumber("Pen sofa fra 2021, 3-seter"), null);
  assert.equal(extractModelNumber("TV 55 tommer 3840x2160"), null);
});

test("extractModelNumber velger lengste kandidat", () => {
  assert.equal(
    extractModelNumber("LG OLED55C24LA 55TUM oled55 tv"),
    "OLED55C24LA",
  );
});

test("parseCondition mapper Finn-tilstander", () => {
  assert.equal(parseCondition("Ny"), "ny");
  assert.equal(parseCondition("Helt ny"), "ny");
  assert.equal(parseCondition("Som ny"), "som_ny");
  assert.equal(parseCondition("Godt brukt"), "brukt");
  assert.equal(parseCondition("Brukt"), "brukt");
  assert.equal(parseCondition(undefined), "ukjent");
  assert.equal(parseCondition("noe rart"), "ukjent");
});
