const app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope) {
    $scope.project = {};
    $scope.loading = '';
    $scope.onAdd = () =>{
        $('#modal').modal('toggle');
        $scope.project = {};
    }
    $scope.submit = () => {
        if ($scope.project['_id']) {
            editProject($scope.project, () => {
                getListProject((data) => {
                    $scope.project = {}
                    $('#modal').modal('toggle');
                    $scope.listProject = data;
                    $scope.$apply()
                })
            })
        } else {
            addProject($scope.project, () => {
                getListProject((data) => {
                    $scope.project = {}
                    $('#modal').modal('toggle');
                    $scope.listProject = data;
                    $scope.$apply()
                })
            });
        }
    }
    $scope.onEdit = (data) => {
        $('#modal').modal('toggle');
        $scope.project = {...data};
    }
    $scope.onRemove = (data) => {
        deleteProject(data['_id'], () => {
            getListProject((data) => {
                $scope.listProject = data;
                $scope.$apply()
            })
        })
    }
    $scope.deploy = (data) => {
        $scope.loading = data['_id'];
        deployProject(data, () => {
            alert('Deploy thành công');
            $scope.loading = '';
            $scope.$apply()
        }, () => {
            $scope.loading = '';
            $scope.$apply()
        })
    }
    getListProject((data) => {
        $scope.listProject = data;
        $scope.$apply()
    })
});

function addProject(project, success) {
    fetch('/server', {
        method: 'POST', body: JSON.stringify(project),
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    }).then(response => response.json()).then((data) => {
        success()
    }).catch((error) => {
        alert(error.message);
    })
}

function editProject(project, success) {
    fetch('/server', {
        method: 'PUT', body: JSON.stringify(project),
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    }).then(response => response.json()).then((data) => {
        success()
    }).catch((error) => {
        alert(error.message);
    })
}

function deleteProject(id, success) {
    const r = confirm("Xác nhận xóa");
    if (r) {
        fetch(`/server/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(response => response.json()).then((response) => {
            success()
        }).catch((error) => {
            alert(error.message)
        })
    }

}

function getListProject(success) {
    fetch('/server')
        .then(response => response.json())
        .then(data => {
            success(data)
        });
}

function deployProject(project, success, error) {
    build(project, () => {
        fetch('/deploy', {
            method: 'POST', body: JSON.stringify(project),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then((data) => {
            if (data.error) {
                error();
                alert(data.error)
            } else {
                success(data)
            }
        }).catch((error) => {
            console.log(error)
            alert(error.message)
        })
    })
}

function build(project, success) {
    fetch('/build', {
        method: 'POST', body: JSON.stringify(project),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json()).then((data) => {
        if (data.error) {
            alert(data.error)
        } else {
            success(data)
        }
    }).catch((error) => {
        console.log(error)
        alert(error.message)
    })
}
