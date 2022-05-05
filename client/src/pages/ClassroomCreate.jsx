import React from 'react'

//classroom create form

function ClassroomCreate() {
  return (
    <div>
      <h1>ClassroomCreate</h1>
      <form>
        <label>
          Classroom Name:
          <input type="text" name="classroomName" />
        </label>
        <label>
          Classroom Description:
          <input type="text" name="classroomDescription" />
        </label>
        <label>
          Classroom Password:
          <input type="text" name="classroomPassword" />
        </label>
        <button type="submit">Create Classroom</button>
      </form>
    </div>
  )
}

export default ClassroomCreate