import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators'
import { ImageService } from 'src/app/shared/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  imgSrc! : string;
  selectedImage: any = null;
  isSubmitted:boolean = false;

  formTemplate = new FormGroup({
    caption : new FormControl('', Validators.required),
    author : new FormControl('', Validators.required),
    imageUrl : new FormControl('', Validators.required)
  })

  constructor(private storage: AngularFireStorage, private service:ImageService) { }

  ngOnInit(): void {
    this.resetForm();
  }

  showPreview(event:any) {
    if(event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e:any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      this.imgSrc = 'https://shacknews-ugc.s3.amazonaws.com/user/9647/article/2021-03/feature_template.jpg?versionId=nddKZddYOhg2ylBtIjyrfNPxR7LuedFw';
      this.selectedImage = null;
    }
  }

  onSubmit(formValue:any) {
    this.isSubmitted = true;
    if(this.formTemplate.valid) {
      var filePath = `image/${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imageUrl'] = url;
            this.service.insertImageDetails(formValue );
            this.resetForm();
          })
        })
      ).subscribe();
    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      caption: '',
      imageUrl: '',
      author: ''
    });
    this.imgSrc = 'https://shacknews-ugc.s3.amazonaws.com/user/9647/article/2021-03/feature_template.jpg?versionId=nddKZddYOhg2ylBtIjyrfNPxR7LuedFw';
    this.selectedImage = null;
    this.isSubmitted = false;
  }

}
