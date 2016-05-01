/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var inputdb=
{
    baseDataPath :"inputdata/base_data.json",
    categories: [],
    load: function()
    {
         d3.json(this.baseDataPath, function (error, data) {
             var categoryKeys = Object.keys(data.categories);
             for(var categoryIndex =0;categoryIndex < categoryKeys.length;categoryIndex++)
             {
                 var category = data.categories[categoryKeys[categoryIndex]];
                 
                 inputdb.categories[categoryIndex] = category;
                 inputdb.categories[categoryIndex].modules=[];
                 
                 var moduleKeys = Object.keys(inputdb.categories[categoryIndex].subCategory);
                 
                 for(var moduleIndex =0;moduleIndex < moduleKeys.length;moduleIndex++)
                 {
                     var moduleDataFilePaths = inputdb.categories[categoryIndex].subCategory[moduleKeys[moduleIndex]].dataFile;
                     
                     d3.json('input'+moduleDataFilePaths, function (error, data)
                     {
                         var indices = data.id.split(/\D/).clean(''); // example id c0m1 => category 0 , module 1
                         var dataCategoryIndex = indices[0]; 
                         var dataModuleIndex = indices[1];
                         var category =inputdb.categories[dataCategoryIndex];
                         category.modules[dataModuleIndex] = data;
                        
                         
                     });
                 }
             }
             
             
             
         });
         
    },
    additionalProperties:{},
    loadAdditionalProperties: function()
    {
        var baseDirectory ="inputdata/properties/";
        var baseFile = "base.txt";
        var filePath = baseDirectory+baseFile;
        d3.text(filePath,  function(d) {
            var properties = d3.csv.parseRows(d);
            for(var i=0;i<properties.length;i++)
            {
                var property = properties[i][0];
                inputdb.additionalProperties[property] ={};
                d3.text(baseDirectory+property+".txt", function(propertyData)
                {
                    var lines = d3.tsv.parseRows(propertyData);
                    console.log(property)
                    for(var j=0;j<lines.length;j++)
                    {
                        var key = lines[j][0];
                        var value = lines[j][1];
                        inputdb.additionalProperties[properties][key] = value;
                    }
                });
            }
          });
    },
    getAdditionalProperties: function(id)
    {
         var colonIndex = id.indexOf(':'); 
         var atIndex = id.indexOf('@');
         var strId = id.substring(atIndex+1, id.length);
         
         var propertyKeys = Object.keys( inputdb.additionalProperties);
         var propertyObj ={};
         for(var i=0;i<propertyKeys.length;i++)
         {
             var propertyKey = propertyKeys[i];
             var ids = Object.keys(inputdb.additionalProperties[propertyKey]);
             for(var j=0;j<ids.length;j++)
             {
                 if(strId == ids[j])
                 {
                     propertyObj[propertyKey] = inputdb.additionalProperties[propertyKey][ids[j]];
                 }
                 else if(ids[j].indexOf("*")> -1)
                 {
                     var starIndex = ids[j].indexOf("*");
                     var prefix = ids[j].substring(0, starIndex);
                     if(strId.indexOf(prefix) === 0)
                     {
                         propertyObj[propertyKey] = inputdb.additionalProperties[propertyKey][ids[j]];
                     }
                 }   
             }
         }
         return propertyObj;
    },
    getContent : function(id)
    {
         var colonIndex = id.indexOf(':'); 
         var atIndex = id.indexOf('@');
         var strId = id.substring(atIndex+1, id.length);
         var type=id.substring(colonIndex+1, atIndex);
         
         var keys = strId.split(/\d/).clean('');
         var values = strId.split(/\D/).clean('');
         var objectId={navigationText:'' };
         
         
         for(var i=0;i<keys.length;i++)
         {
             this.setItem(keys[i], values[i], objectId)
             
         }
         var selected = {"object":objectId.current.object, 
             "typeText":objectId.current.typeText, 
             "type":type, 
             'navigationText':objectId.navigationText,
             'image':objectId.image,
             'aoi':objectId.aoi,
             'additionalProperties':inputdb.getAdditionalProperties(id)
         };
         
         console.log(id+":"+JSON.stringify(selected));
         return selected;
         
    },
    getLabel: function(id)
    {
       
       var content = this.getContent(id);
       var colonIndex = id.indexOf(':'); 
       var name = id.substring(0,colonIndex);
       var suffix = "("+content.typeText+")";
       var label =name+suffix;
       if(label.length > maxLabelChars)
       {
           label = name.substring(0,maxLabelChars-suffix.length-3)+"..."+suffix;
       }
       return label;
    },
    setItem : function( key, value, object)
    {
       
        
        if(key === 'c') //category
        {
            object.current = { object: this.categories[value] , parent:{}};
            object.currentKey =key;
            object.navigationText+= 'category:'+ object.current.object.name;
        }
        else if(key === 'p')
        {
            if(object.currentKey ==='c')
            {
                object.current ={ 
                            object:{ 
                                        'title': object.current.object.name,
                                        'text': object.current.object.description
                                    }
                            ,parent:object.current
                            }
                        ;
                object.current.typeText = 'Category Description';
                object.navigationText+= '=> Category Description';
            }
            else if(object.currentKey ==='m')
            {
                 object.current ={ 
                            object:object.current.object.description
                            ,parent:object.current
                            }
                        ;
                 object.current.typeText = 'Module Description';
                 object.navigationText+= '=> Module Description';
            }
            else if(object.currentKey ==='s')
            {
                object.current ={ 
                            object:object.current.object.description[value]
                            ,parent:object.current
                            }
                        ;
                object.current.typeText = 'SubModule Description';
                object.navigationText+= '=> SubModule Description';
            }
            object.currentKey =key;
        }
        else if(key === 'h')
        {
            if(object.currentKey === 'p')
            {
                object.current ={ 
                            object:object.current.object.title
                            ,parent:object.current
                            }
                        ;
                object.currentKey =key;    
                object.current.typeText = 'Paragraph heading';
                object.navigationText+= '=> Heading:'+object.current.object;
            }
            else if(object.currentKey === 'm')
            {
                object.current ={ 
                                object:object.current.object.moduleName
                                ,parent:object.current
                            }
                        ;
                object.currentKey =key;    
                object.current.typeText = 'Module Name';
                object.navigationText+= '=> Module Name:'+object.current.object;
            }
            else if(object.currentKey === 's')
            {
                object.current ={ 
                                object:object.current.object.subModuleName
                                ,parent:object.current
                            }
                        ;
                object.currentKey =key;    
                object.current.typeText = 'Submodule Name';
                object.navigationText+= '=> Submodule Name:'+object.current.object;
            }
            else if(object.currentKey === 'g')
            {
                object.current ={ 
                                object:'HomeLogo Text'
                                ,parent:object.current
                            }
                        ;
                object.currentKey =key;    
                object.current.typeText = 'HomeLogo Text';
                object.navigationText+= '=> HomeLogo Text';
            }
            
        }
        else if(key === 'm')
        {
            if(object.currentKey==='c')
            {
                object.current ={ 
                                object:object.current.object.modules[value]
                                ,parent:object.current
                            }
                        ;
                object.currentKey =key;
                object.current.typeText = 'Module';
                object.navigationText+= '=> Module:'+object.current.object.moduleName;
            }
            
            
        }
        else if(key === 's')
        {
            object.current ={ 
                                object:object.current.object.submodule[value]
                                ,parent:object.current
                            }
                        ;
            object.currentKey =key;
            object.current.typeText = 'Submodule';
            object.navigationText+= '=> Submodule:'+object.current.object.subModuleName;
        }
        else if(key === 'i')
        {
            if(object.currentKey==='s')
            {
                object.current ={ 
                                object:object.current.object.mediaList[value]
                                ,parent:object.current
                            }
                        ;
                object.current.typeText = 'Media Image';
                object.navigationText+= '=> Media Image';
                object.image ={path:object.current.object.mediaImage, 
                                dimension:[object.current.object.aoiData.width,object.current.object.aoiData.height] };
            }
            object.currentKey =key;
        }
        else if(key === 'a')
        {
            if(object.currentKey==='i')
            {
                object.current ={ 
                                object:{
                                    imageName: object.current.object.aoiData.imageName,
                                    aoi: object.current.object.aoiData.aoiItemList[value]
                                }
                                ,parent:object.current
                            }
                        ;
                object.current.typeText = 'AOI';
                object.navigationText+= '=> AOI';
                object.image ={path:object.current.parent.object.mediaImage, 
                                dimension:[object.current.parent.object.aoiData.width,object.current.parent.object.aoiData.height] };
               
                object.aoi =object.current.object.aoi;
            }
            object.currentKey =key;
        }
        else if(key === 't')
        {
            if(object.currentKey==='s')
            {
                object.current ={ 
                                object:object.current.object.mediaList[value]
                                ,parent:object.current
                            }
                        ;
                object.current.typeText = 'Media Button';
                object.navigationText+= '=> Media Button';
                object.image ={path:object.current.object.mediaImage, 
                                dimension:[object.current.object.aoiData.width,object.current.object.aoiData.height] };
            }
            object.currentKey =key;
        }
        else if(key === 'ai')
        {
            if(object.currentKey==='s')
            {
                var mediaIndex=-1;
                for(var i=0;i<object.current.object.mediaList.length;i++)
                {
                    if(object.current.object.mediaList[i].additionalMedia)
                    {
                        mediaIndex =i;
                        break;
                    }
                }
                object.current ={ 
                                object:object.current.object.mediaList[mediaIndex].additionalMedia[value]
                                ,parent:object.current
                            }
                        ;
                object.current.typeText = 'Additional Media';
                object.navigationText+= '=> Additional Media';
                object.image ={path:object.current.object, 
                                dimension:[object.current.parent.object.mediaList[mediaIndex].aoiData.width,object.current.parent.object.mediaList[mediaIndex].aoiData.height]  };
            }
            object.currentKey =key;
        }
        else if(key =='g')
        {
            object.current = { object: 'global' , parent:{}};
            object.currentKey =key;
            object.navigationText+= 'global';
        }
        
         
    }
    
            
};
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

