import { IPersonalInfoType } from 'interfaces/common';

export enum DocumentType {
  CC = 'Căn cước công dân',
  CCCD = 'CĂN CƯỚC CÔNG DÂN',
  CMND = 'GIẤY CHỨNG MINH NHÂN DÂN',
  CMND12 = 'CHỨNG MINH NHÂN DÂN',
}

export const getDocumentType = (document: string): IPersonalInfoType => {
  switch (document) {
    case DocumentType.CC:
      return 'CC';
    case DocumentType.CCCD:
      return 'CC';
    case DocumentType.CMND:
      return 'CMND';
    case DocumentType.CMND12:
      return 'CMND';
    default:
      return 'PASSPORT';
  }
};
