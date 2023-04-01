const apiPrefix = "https://node.deso.org/api/v0/"
const webAppPrefix = 'https://node.deso.org' 

export async function createSubmitPostTransaction(settings) {

    let {
          UpdaterPublicKeyBase58Check, 
          ParentStakeID = '', 
          RepostedPostHashHex = '',
          PostHashHexToModify = '',
          Body = '', 
          ImageURLs = null,
          VideoURLs = null,
          PostExtraData = null,
          MinFeeRateNanosPerKB
    } = settings

    const data = {
        "UpdaterPublicKeyBase58Check": UpdaterPublicKeyBase58Check,
        "PostHashHexToModify": PostHashHexToModify,
        "ParentStakeID": ParentStakeID,
        "Title": "",
        "BodyObj": {
            "Body": Body,
            "ImageURLs": ImageURLs,
            "VideoURLs": VideoURLs
        },
        "RepostedPostHashHex": RepostedPostHashHex,
        "PostExtraData": PostExtraData,
        "Sub": "",
        "IsHidden": false,
        "MinFeeRateNanosPerKB": MinFeeRateNanosPerKB,
        "InTutorial": false           
    }
  
    const url = `${apiPrefix}submit-post`
  
    const params = {
        method:'POST',
        body:JSON.stringify(data),
        headers: { 'Content-Type': 'application/json'}
    }
  
    try {
        const res = await fetch(url, params)
        const result = await res.json()   
        return {...result}        
    } catch (error) {
        return {...error} 
    }


}  

export async function createAssociationTransaction(settings) {

    let {
            TransactorPublicKeyBase58Check, 
            PostHashHex,
            AppPublicKeyBase58Check,
            AssociationType,
            AssociationValue,
            ExtraData = {},
            MinFeeRateNanosPerKB,
            TransactionFees = []
    } = settings

    const data = {
        "TransactorPublicKeyBase58Check": TransactorPublicKeyBase58Check,
        "PostHashHex": PostHashHex,
        "AppPublicKeyBase58Check": AppPublicKeyBase58Check,
        "AssociationType": AssociationType,
        "AssociationValue": AssociationValue,
        "ExtraData": ExtraData,
        "MinFeeRateNanosPerKB": MinFeeRateNanosPerKB,
        "TransactionFees": TransactionFees          
    }

    const url = `${apiPrefix}post-associations/create`

    const params = {
        method:'POST',
        body:JSON.stringify(data),
        headers: { 'Content-Type': 'application/json'}
    }

    try {
        const res = await fetch(url, params)
        const result = await res.json()   
        return {...result}        
    } catch (error) {
        return {...error} 
    }


}   

export async function getAssociationsCounts(settings) {

    let {
        AssociationType,
        AssociationValues,
        PostHashHex
    } = settings

    const data = {
        "AssociationType": AssociationType,
        "AssociationValues": AssociationValues,
        "PostHashHex": PostHashHex          
    }

    const url = `${apiPrefix}post-associations/counts`

    const params = {
        method:'POST',
        body:JSON.stringify(data),
        headers: { 'Content-Type': 'application/json'}
    }

    try {
        const res = await fetch(url, params)
        const result = await res.json()   
        return {...result}        
    } catch (error) {
        return {...error} 
    }


}   

export async function associationsQuery(settings) {

    let {
        AssociationType,
        AssociationValue,
        AssociationValues,
        Limit,
        PostHashHex,
        SortDescending,
        IncludeTransactorProfile,
        TransactorPublicKeyBase58Check
    } = settings

    const data = {
        "AssociationType": AssociationType,
        "AssociationValue": AssociationValue,
        "AssociationValues": AssociationValues,
        "Limit": Limit,
        "PostHashHex": PostHashHex,
        "SortDescending": SortDescending,
        "IncludeTransactorProfile": IncludeTransactorProfile,
        "TransactorPublicKeyBase58Check": TransactorPublicKeyBase58Check
    }

    const url = `${apiPrefix}post-associations/query`

    const params = {
        method:'POST',
        body:JSON.stringify(data),
        headers: { 'Content-Type': 'application/json'}
    }

    try {
        const res = await fetch(url, params)
        const result = await res.json()   
        return {...result}        
    } catch (error) {
        return {...error} 
    }


}  

export async function deleteAssociationTransaction(settings) {

    let {
            TransactorPublicKeyBase58Check, 
            AssociationID,
            ExtraData = {},
            MinFeeRateNanosPerKB,
            TransactionFees = []
    } = settings
    
    const data = {
        "TransactorPublicKeyBase58Check": TransactorPublicKeyBase58Check,
        "AssociationID": AssociationID,
        "ExtraData": ExtraData,
        "MinFeeRateNanosPerKB": MinFeeRateNanosPerKB,
        "TransactionFees": TransactionFees          
    }
    
    const url = `${apiPrefix}post-associations/delete`
    
    const params = {
        method:'POST',
        body:JSON.stringify(data),
        headers: { 'Content-Type': 'application/json'}
    }
    
    try {
        const res = await fetch(url, params)
        const result = await res.json()   
        return {...result}        
    } catch (error) {
        return {...error} 
    }
    
    
}   

export async function getSingleProfile(settings) {

    let {PublicKeyBase58Check = '', Username = ''} = settings

    const data = {        
        PublicKeyBase58Check,
        Username
    }
  
    const url = `${apiPrefix}get-single-profile`
  
    const params = {
        method:'POST',
        body:JSON.stringify(data),
        headers: { 'Content-Type': 'application/json'}
    }
  
    try {
        const res = await fetch(url, params)
        const result = await res.json()   
        return {...result}        
    } catch (error) {
        return {...error} 
    }


}

export async function getSinglePost(settings) {

    let {CommentLimit = 10, PostHashHex, CommentOffset = 0, ReaderPublicKeyBase58Check = ''} = settings

    const data = {
        "AddGlobalFeedBool": false,
        "CommentLimit": CommentLimit,
        "CommentOffset": CommentOffset,
        "FetchParents": false,
        "PostHashHex": PostHashHex,
        "ReaderPublicKeyBase58Check": ReaderPublicKeyBase58Check            
    }
  
    const url = `${apiPrefix}get-single-post`
  
    const params = {
        method:'POST',
        body:JSON.stringify(data),
        headers: { 'Content-Type': 'application/json'}
    }
  
    try {
        const res = await fetch(url, params)
        const result = await res.json()   
        return {...result}        
    } catch (error) {
        return {...error} 
    }


}

export const avatarUrl = (Profile) => {

    if(Profile){
        let avatarImage = `${apiPrefix}get-single-profile-picture/${Profile.PublicKeyBase58Check}?fallback=${webAppPrefix}/assets/img/default_profile_pic.png`

        if(Profile.ExtraData && Profile.ExtraData.LargeProfilePicURL){
            avatarImage = Profile.ExtraData.LargeProfilePicURL
        }
    
        if(Profile.ExtraData && Profile.ExtraData.NFTProfilePictureUrl){
            avatarImage = Profile.ExtraData.NFTProfilePictureUrl 
        }
    
        return avatarImage
    } else {
        return `${webAppPrefix}/assets/img/default_profile_pic.png`
    }

}

export const timestampToDate = (TimestampNanos) => {
    return new Date(Math.round(TimestampNanos/1000000)).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) + ", " + new Date(Math.round(TimestampNanos/1000000)).toLocaleTimeString('en-GB')
}