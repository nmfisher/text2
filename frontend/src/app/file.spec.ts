import { File, FileList } from './file';
import { Label, LabelList  } from './label';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

xdescribe('File Unit Tests', () => {
    
    var label = new Label({} as Http, {});
    label.name = "my_label";
    label.id = "1";
    var labels = [label];
    var emptyGet;
    var nonEmptyGet;
    var emptyPost;
    var nonEmptyPost;
    
    beforeEach(() => {
        nonEmptyGet =  (url: any) => { 
            return Observable.fromPromise(
                new Promise((resolve, reject) => {
                    resolve({json: () => { return labels } });
                })
            ); 
        }
        emptyGet = (url: any) => { 
            return Observable.fromPromise(
                new Promise((resolve, reject) => {
                    resolve({json: () => { null } });
                })
            ); 
        }
        nonEmptyPost = {
            post: (url:any, body: Object, headers: any) => {
                return Observable.fromPromise(
                    new Promise((resolve, reject) => {
                        resolve({json: () => { return label } });
                    })
                ); 
            }
        } 
        emptyPost = {
            post: (url:any, body: Object, headers: any) => {
                return Observable.fromPromise(
                    new Promise((resolve, reject) => {
                        resolve({json: () => { return null } });
                    })
                ); 
            }
        } 
    });
        
        
    it('containsAny should return true when the file is labelled with a label', () => {
        new File({get:nonEmptyGet} as Http, { find: (id) => {return label } } as LabelList, {})
            .containsAny([label]).then((contains) => {
                expect(contains).toBe(true);    
            })
    });
    
    it('containsAny should return false when the file is not labelled with a label', () => {
        new File({get:nonEmptyGet} as Http, { } as LabelList, {})
                .containsAny([label]).then((contains) => {
                    expect(contains).toBe(false);    
                })
    });
    
    it('contains should return false when the file is not labelled with a label', () => {
        new File({get:nonEmptyGet} as Http, { } as LabelList, {})
                .contains(label).then((contains) => {
                    expect(contains).toBe(false);    
                })
    });
    
    it('contains should return true when the file is not labelled with a label', () => {
        new File({get:nonEmptyGet} as Http, { } as LabelList, {})
                .contains(label).then((contains) => {
                    expect(contains).toBe(true);    
                })
    });
    
    it('when a file does not contain a label, toggling a label should add it', () => {
        new File({get:emptyGet, post:nonEmptyPost} as Http, { find: (id) => { return label } } as LabelList, {})
                .toggleLabel(label).then((labels) => {
                    expect(labels[0]).toBe(label);    
                })
                
    });
    
    it('when a file does contain a label, toggling a label should remove it', () => {
        new File({get:nonEmptyGet, post:nonEmptyPost} as Http, { find: (id) => { return label } } as LabelList, {}).toggleLabel(label).then((labels) => {
           expect(labels.length).toBe(0);    
        })
    });
});



