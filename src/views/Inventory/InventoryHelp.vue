<template>
  <section id="bulk upload">
    <div class="container-lg">
      <div class="row bg-light align-items-center text-start mb-5">
        <div
          class="col-md-12 py-4 ps-5 display-4"
          style="font-family: 'Times New Roman', serif"
        >
          Inventory Help
        </div>
      </div>
      <div class="row justify-content-start align-items-center">
        <div class="col-md-10 text-center text-md-start">
          <p class="text-secondary fs-1 fw-bold text-capitalize">
            <u>How to upload your inventory</u>
          </p>
          <div class="row ps-2 pt-3">
            <h2 class="text-secondary fs-2 fw-bold text-capitalize pb-2">
              <u>Step 1</u>
            </h2>
            <div class="pb-2">
              <p class="text-muted fs-4 d-inline">
                Please download the Standardized Drug Format Excel sheet
              </p>
              <a
                href="https://storage.googleapis.com/pharmacist-data/Drug%20Inventory%20From/Drug%20Inventory%20Form.xlsx"
                role="button"
                class="d-inline fs-5 text-warning"
                ><u>Here</u></a
              >
            </div>
          </div>
          <div class="row ps-2 pt-3">
            <h2 class="text-secondary fs-2 fw-bold text-capitalize pb-2">
              <u>Step 2</u>
            </h2>
            <div class="pb-4">
              <p class="text-muted fs-4 d-inline">
                Take a look at the provied example form
              </p>
              <a
                target="_blank"
                href="https://docs.google.com/spreadsheets/d/1MiwaeCS-ddcePkQlC9_4J7-q0_AVMizkT7vCqquADmg/edit?usp=sharing"
                role="button"
                class="d-inline fs-5 text-warning"
                ><u>Here</u></a
              >
            </div>
            <img
              class="img-fluid max-width:90% ms-4"
              src="https://storage.googleapis.com/pharmacist-data/Drug%20Inventory%20From/Drug%20Form%20Example.png"
              alt=""
              srcset=""
            />
          </div>
          <div class="row ps-2 pt-5">
            <h2 class="text-secondary fs-2 fw-bold text-capitalize pb-2">
              <u>Step 3</u>
            </h2>
            <div class="pb-4">
              <p class="text-muted fs-4 d-inline">
                Validation Rules:
                <strong class="text-danger"><u>Read Carefully</u></strong>
              </p>
              <div class="ps-2 pt-3">
                <p class="fs-5 fw-bold text-secondary"><u>Drug Name</u></p>
                <ul>
                  <li>
                    <p class="text-secondary">
                      The Drug Name should be the Scientific name of the
                      substance
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      All subsequent fields require that you fill the Drug Name
                      before their value can be accepted
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      Example:
                      <strong
                        >Diazepam, Phenobarbital , Ciprofloxacin, and
                        Nitrofurantoin</strong
                      >
                      are examples of some common drug names
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      The Drug Name is required and should be filled at all
                      times
                    </p>
                  </li>
                </ul>
              </div>
              <div class="ps-2 pt-3">
                <p class="fs-5 fw-bold text-secondary"><u>Price</u></p>
                <ul>
                  <li>
                    <p class="text-secondary">
                      The Price must be a non negative number that is greater
                      than <u>Zero</u>
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      Examples of
                      <span class="bg-danger text-white px-2">invalid</span> and
                      <span class="bg-success text-white px-2">valid</span>
                      <strong> Price</strong> values
                    </p>
                    <p class="ms-3 col-md-3 ps-2 bg-danger text-white">-2</p>
                    <p class="ms-3 col-md-3 ps-2 bg-danger text-white">0</p>
                    <p class="ms-3 col-md-3 ps-2 bg-success text-white">120</p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      The Price is required and should be filled at all times
                    </p>
                  </li>
                </ul>
              </div>
              <div class="ps-2 pt-3">
                <p class="fs-5 fw-bold text-secondary"><u>In Stock</u></p>
                <ul>
                  <li>
                    <p class="text-secondary">
                      In Stock Value represents the amount of the current
                      product that you currently have
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      In Stock Value must be a positive Integer
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      In Stock is required and should be filled at all times
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      Examples of
                      <span class="bg-danger text-white px-2">invalid</span> and
                      <span class="bg-success text-white px-2">valid</span>
                      <strong> In Stock</strong> values
                    </p>
                    <p class="ms-3 col-md-3 ps-2 bg-danger text-white">-2</p>
                    <p class="ms-3 col-md-3 ps-2 bg-success text-white">21</p>
                    <p class="ms-3 col-md-3 ps-2 bg-danger text-white">bruh</p>
                    <p class="ms-3 col-md-3 ps-2 bg-success text-white">0</p>
                  </li>
                </ul>
              </div>
              <div class="ps-2 pt-3">
                <p class="fs-5 fw-bold text-secondary">
                  <u>Prescription Required</u>
                </p>
                <ul>
                  <li>
                    <p class="text-secondary">
                      Prescription Required represents whether the current
                      product requires a <strong>Doctor's Prescription</strong>
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      Make sure that this value is either
                      <strong>TRUE</strong> or <strong>FALSE</strong> any other
                      value will be rejected. A Blank value will also be
                      rejected
                    </p>
                  </li>

                  <li>
                    <p class="text-secondary">
                      Examples of
                      <span class="bg-danger text-white px-2">invalid</span> and
                      <span class="bg-success text-white px-2">valid</span>
                      <strong> Prescription Required</strong> values
                    </p>
                    <p class="ms-3 col-md-3 ps-2 bg-danger text-white">2</p>
                    <p class="ms-3 col-md-3 ps-2 bg-success text-white">TRUE</p>
                    <p class="ms-3 col-md-3 ps-2 bg-danger text-white">True</p>
                    <p class="ms-3 col-md-3 ps-2 bg-success text-white">
                      FALSE
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      Prescription Required is required and should be filled at
                      all times
                    </p>
                  </li>
                </ul>
              </div>
              <div class="ps-2 pt-3">
                <p class="fs-5 fw-bold text-secondary">
                  <u>Drug Description</u>
                </p>
                <ul>
                  <li>
                    <p class="text-secondary">
                      Drug Description represents The expected behavior of the
                      drug, The common uses of the drug, who it is usually
                      prescribed to and how it should be administered
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      A Breif Description of the drug is enough to satisfy the
                      requirements
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      The value should be between
                      <strong>10-500</strong> characters
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      Examples of
                      <span class="bg-danger text-white px-2">invalid</span> and
                      <span class="bg-success text-white px-2">valid</span>
                      <strong> Drug Description</strong> values
                    </p>
                    <p class="ms-3 col-md-3 ps-2 bg-danger text-white">
                      painless
                    </p>
                    <p class="ms-3 col-md-3 ps-2 bg-success text-white">
                      Relieves pain
                    </p>
                    <p class="ms-3 col-md-3 ps-2 bg-danger text-white">Empty</p>
                    <p class="ms-3 col-md-6 ps-2 bg-success text-white">
                      Capsule: 250 mg. Oily suspension for injection : 0.5 g (as
                      sodium succinate)/ml in 2‐ml ampoule. * Only for the
                      presumptive treatment of epidemic meningitis in children
                      older than 2 years. Oral liquid: 150 mg (as palmitate)/5
                      ml. Powder for injection: 1 g (sodium succinate) in vial.
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      Drug Description is required and should be filled at all
                      times, even if the description is minimal
                    </p>
                  </li>
                </ul>
              </div>
              <div class="ps-2 pt-3">
                <p class="fs-5 fw-bold text-secondary"><u>Brand Name</u></p>
                <ul>
                  <li>
                    <p class="text-warning"><u>This Value is optional</u></p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      Brand Name represents the brand name of the drug.
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      The value should be between
                      <strong>0-50</strong> characters
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      Example:
                      <strong>Tylenol, Excedrin, Calpol, and Panadol</strong>
                      are brand names of <strong>paracetamol</strong>
                    </p>
                  </li>
                </ul>
              </div>
              <div class="ps-2 pt-3">
                <p class="fs-5 fw-bold text-secondary">
                  <u>Country of origin</u>
                </p>
                <ul>
                  <li>
                    <p class="text-warning"><u>This Value is optional</u></p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      Country of origin represents where the drug is
                      manufactured
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      The value should be between
                      <strong>0-25</strong> characters
                    </p>
                  </li>
                  <li>
                    <p class="text-secondary">
                      Examples of
                      <span class="bg-danger text-white px-2">invalid</span> and
                      <span class="bg-success text-white px-2">valid</span>
                      <strong> Country of origin</strong> values
                    </p>
                    <p class="ms-3 col-md-3 ps-2 bg-danger text-white">Empty</p>
                    <p class="ms-3 col-md-3 ps-2 bg-success text-white">
                      New Zeland
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row ps-2 pt-3">
            <h2 class="text-secondary fs-2 fw-bold text-capitalize pb-2">
              <u>Step 4</u>
            </h2>
            <div class="pb-4">
              <p class="text-muted fs-4">
                Make sure that none of your rows contain boxes with a
                <span class="bg-danger text-white px-2">red</span> background
              </p>
              <p class="text-warning fs-4 d-inline">Note:</p>
              <ul>
                <li>
                  <p class="text-secondary">
                    If a row contains an invalid value, the row will be
                    discarded, however all rows that abide by the rules will be
                    sent to the server. The discarded rows will be displayed to
                    you immediately.
                  </p>
                </li>
                <li>
                  <p class="text-secondary">
                    If you would like to upload two drugs with the same
                    scientific name. <br />
                    Such as tylenol and panadol which share paracetamol as their
                    official name. <br />
                    Make sure to include the <strong>brand names</strong> together with
                    paracetamol. <br />
                    otherwise it will be rejected.
                  </p>
                </li>
                <li>
                  <p class="text-secondary">
                    If you have a drug in your excel file that already exists in
                    your inventory, it will be rejected
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div class="row ps-2 pt-3">
            <h2 class="text-secondary fs-2 fw-bold text-capitalize pb-2">
              <u>Step 5</u>
            </h2>
            <div class="pb-4">
              <p class="text-muted fs-4">
                Either press the <strong class="bg-secondary badge">Browse File</strong> button and select an Excel(".xlsx") file <br> or drop an Excel file onto the outlined area then wait while the file is validated. <br> If your file has errors, the problems will be displayed as follows 
              </p>
               
              
             
            </div>
            <img
              class="img-fluid max-width:90% ms-4"
              src="https://storage.googleapis.com/pharmacist-data/Drug%20Inventory%20From/Repetition%20Errors.png"
              alt=""
              srcset=""
            />
            <img
              class="img-fluid max-width:90% ms-4"
              src="https://storage.googleapis.com/pharmacist-data/Drug%20Inventory%20From/Validation%20Errors.png"
              alt=""
              srcset=""
            />
          </div>
          <div class="row ps-2 pt-5">
            <h2 class="text-secondary fs-2 fw-bold text-capitalize pb-2">
              <u>Step 6</u>
            </h2>
            <div class="pb-4">
              <p class="text-muted fs-4">
                Press the <strong class="bg-dark badge fs-5">Upload</strong> button and wait for the server to reply
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap';
export default {};
</script>

<style>
</style>