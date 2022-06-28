import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoServiceService {
  constructor(private title:Title,private meta:Meta) {
  }
  generatesTags(tags:any){
    tags={
      title:'Angular ssr',
      description:'Angular Universal',
      image:'https://res.cloudinary.com/drmnyie0t/image/upload/v1652498915/blue_oz08g2_fzsuc7.png',
      slug:'',
      ...tags
    };
    this.title.setTitle(tags.title);
    this.meta.updateTag({property:'og:description',content:tags.description})
    this.meta.updateTag({property:'og:image',content:tags.image})
  }
}
