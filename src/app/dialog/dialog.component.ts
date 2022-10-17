import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand New","Second Hand","Refurbished"];
  productForm! : UntypedFormGroup;
  actionBtn: string = 'Save';

  constructor(private formBuilder: UntypedFormBuilder,private api: ApiService,
    private dialog: MatDialogRef<DialogComponent>, //MatDialogRef is used to close the DialogComponent
    @Inject(MAT_DIALOG_DATA) public editData:any   //Mat_Dialog_Data to hold the row data when the edit icon is clicked in App Component
    ) 
    { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({   //Map the form elements with formBuilder
      productName : ['',Validators.required],
      category: ['',Validators.required],
      freshness: ['',Validators.required],
      price: ['',Validators.required],
      comment: ['',Validators.required],
      date: ['',Validators.required]
    })

    if(this.editData !== undefined && this.editData !== null){            //Check if Edit icon has been clicked and form's control needs to be filled with row data
      console.log("Editing Data..!! " + this.editData.productName);
      this.productForm.controls["productName"].setValue(this.editData.productName);
      this.productForm.controls["category"].setValue(this.editData.category);
      this.productForm.controls["freshness"].setValue(this.editData.freshness);
      this.productForm.controls["price"].setValue(this.editData.price);
      this.productForm.controls["comment"].setValue(this.editData.comment);
      this.productForm.controls["date"].setValue(this.editData.date);
      this.actionBtn = "Update";
    } 

    console.log(this.editData);
  }

  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe((res) => 
        {
          alert("Product Added");
          this.productForm.reset(); //Resets the form
          this.dialog.close('save');  //Closes the form and passes the value 'save' to indicate that Save button was clicked
        }
        ,(err) => {alert("Unable to add product");})
      }
    }
    else
    {
      this.updateProduct();
    }
  }

  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe(
      (res)=> {alert("Product updated successfully..!!"); this.productForm.reset(); this.dialog.close("update");},
      (err)=> {alert("Unable to update product..!!")})
  }

}
