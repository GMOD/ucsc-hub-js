/* eslint-disable no-extend-native */
/* eslint-disable func-names */
if (!String.prototype.trimStart) {
  if (String.prototype.trimLeft) {
    String.prototype.trimStart = String.prototype.trimLeft
  } else {
    String.prototype.trimStart = function() {
      return this.replace(/^[\s\uFEFF\xA0]+/g, '')
    }
  }
}

if (!String.prototype.trimEnd) {
  if (String.prototype.trimRight) {
    String.prototype.trimEnd = String.prototype.trimRight
  } else {
    String.prototype.trimEnd = function() {
      return this.replace(/[\s\uFEFF\xA0]+$/g, '')
    }
  }
}
